import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Trees, Upload, X, ImagePlus } from 'lucide-react';
import { parqueService } from '../services/api';
import { imageStorage } from '../services/imageStorage';
import { imageCompression } from '../services/imageCompression';
import { ParqueCreate } from '../types';
import toast from 'react-hot-toast';

const ParqueForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<ParqueCreate>({
    nome: '',
    localizacao: '',
    descricao: '',
    imagens: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditing);

  useEffect(() => {
    console.log('ParqueForm - ID:', id, 'isEditing:', isEditing);
    if (isEditing && id) {
      fetchParque(parseInt(id));
    }
  }, [id, isEditing]);

  const fetchParque = async (parqueId: number) => {
    try {
      console.log('Buscando parque ID:', parqueId);
      const parque = await parqueService.getById(parqueId);
      console.log('Parque encontrado:', parque);
      
      // Carregar imagens do localStorage
      const imagensSalvas = imageStorage.getParqueImages(parqueId);
      console.log('Imagens carregadas do localStorage:', imagensSalvas?.length || 0, 'imagens');
      
      setFormData({
        nome: parque.nome,
        localizacao: parque.localizacao,
        descricao: parque.descricao || '',
        imagens: imagensSalvas,
      });
    } catch (error) {
      console.error('Erro ao carregar parque:', error);
      toast.error('Erro ao carregar parque');
      navigate('/parques');
    } finally {
      setIsFetching(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    console.log('Arquivos selecionados:', files.length);

    Array.from(files).forEach((file, index) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`A imagem ${file.name} é muito grande. Máximo 5MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        console.log(`Imagem ${index + 1} convertida para base64, tamanho:`, base64.length);
        setFormData((prev) => ({
          ...prev,
          imagens: [...(prev.imagens || []), base64],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    console.log('Removendo imagem índice:', index);
    setFormData((prev) => ({
      ...prev,
      imagens: prev.imagens?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log('=== SALVANDO PARQUE ===');
    console.log('isEditing:', isEditing, 'ID:', id);
    console.log('Imagens a salvar:', formData.imagens?.length || 0);

    try {
      // Enviar dados sem imagens para o backend (ele não suporta ainda)
      const { imagens, ...dadosSemImagens } = formData;
      
      // Comprimir imagens antes de salvar (para caber no localStorage)
      let imagensComprimidas: string[] = [];
      if (imagens && imagens.length > 0) {
        console.log('Comprimindo imagens...');
        toast.loading('Comprimindo imagens...', { id: 'compressing' });
        imagensComprimidas = await imageCompression.processImages(imagens, 3, 600, 0.6);
        toast.dismiss('compressing');
        console.log('Imagens comprimidas:', imagensComprimidas.length);
        
        // Mostrar informação de espaço
        const storageInfo = imageCompression.getStorageInfo();
        console.log('Espaço no localStorage:', storageInfo);
      }
      
      if (isEditing && id) {
        console.log('Atualizando parque existente ID:', id);
        await parqueService.update(parseInt(id), dadosSemImagens);
        // Salvar imagens no localStorage
        const salvou = imageStorage.saveParqueImages(parseInt(id), imagensComprimidas);
        console.log('Imagens salvas no localStorage:', salvou);
        if (!salvou) {
          toast.error('Erro ao salvar imagens. Espaço insuficiente.');
        }
        toast.success('Parque atualizado com sucesso!');
      } else {
        console.log('Criando novo parque...');
        const novoParque = await parqueService.create(dadosSemImagens);
        console.log('Novo parque criado:', novoParque);
        
        // Salvar imagens no localStorage com o ID do novo parque
        if (novoParque && novoParque.id) {
          console.log('Salvando imagens para novo parque ID:', novoParque.id);
          const salvou = imageStorage.saveParqueImages(novoParque.id, imagensComprimidas);
          console.log('Imagens salvas no localStorage:', salvou);
          if (!salvou) {
            toast.error('Parque criado, mas houve erro ao salvar imagens.');
          }
        } else {
          console.error('ERRO: Novo parque não retornou ID!', novoParque);
        }
        toast.success('Parque criado com sucesso!');
      }
      
      // Verificar o que está no localStorage
      const todasImagens = imageStorage.getAllParquesImages();
      console.log('Todas as imagens no localStorage:', Object.keys(todasImagens).length, 'parques com imagens');
      
      navigate('/parques');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error(isEditing ? 'Erro ao atualizar parque' : 'Erro ao criar parque');
    } finally {
      setIsLoading(false);
      toast.dismiss('compressing');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Debug: mostrar estado atual
  console.log('Estado atual - Imagens:', formData.imagens?.length || 0);

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <button
        onClick={() => navigate('/parques')}
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Voltar
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <Trees className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Editar Parque' : 'Novo Parque'}
              </h1>
              <p className="text-gray-500 text-sm">
                {isEditing ? 'Atualize as informações do parque' : 'Preencha os dados do novo parque'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Parque <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Ex: Parque Nacional da Serra"
            />
          </div>

          <div>
            <label htmlFor="localizacao" className="block text-sm font-medium text-gray-700 mb-2">
              Localização <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="localizacao"
              name="localizacao"
              value={formData.localizacao}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Ex: Serra da Mantiqueira, SP"
            />
          </div>

          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
              placeholder="Descreva o parque, suas características, atrações..."
            />
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagens do Parque 
              {formData.imagens && formData.imagens.length > 0 && (
                <span className="text-primary-600 ml-2">
                  ({formData.imagens.length} imagens)
                </span>
              )}
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Máximo 3 imagens. Serão comprimidas automaticamente para economizar espaço.
            </p>
            
            {/* Image Preview Grid */}
            {formData.imagens && formData.imagens.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                {formData.imagens.map((imagem, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={imagem}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-700 text-sm">
                  Nenhuma imagem adicionada ainda.
                </p>
              </div>
            )}

            {/* Upload Button */}
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Clique para adicionar imagens</p>
                <p className="text-xs text-gray-400">PNG, JPG até 5MB cada</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/parques')}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                isEditing ? 'Salvar Alterações' : 'Criar Parque'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParqueForm;
