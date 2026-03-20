import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Leaf, X, ImagePlus } from 'lucide-react';
import { biodiversidadeService, parqueService } from '../services/api';
import { imageStorage } from '../services/imageStorage';
import { imageCompression } from '../services/imageCompression';
import { BiodiversidadeCreate, Parque } from '../types';
import toast from 'react-hot-toast';

const BiodiversidadeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<BiodiversidadeCreate>({
    especie: '',
    tipo: '',
    descricao: '',
    parque_id: 0,
    imagens: [],
  });
  const [parques, setParques] = useState<Parque[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditing);
  const [isLoadingParques, setIsLoadingParques] = useState(true);

  useEffect(() => {
    fetchParques();
    if (isEditing && id) {
      fetchBiodiversidade(parseInt(id));
    }
  }, [id, isEditing]);

  const fetchParques = async () => {
    try {
      const data = await parqueService.getAll();
      setParques(data);
      if (data.length > 0 && !isEditing) {
        setFormData((prev) => ({ ...prev, parque_id: data[0].id }));
      }
    } catch (error) {
      toast.error('Erro ao carregar parques');
    } finally {
      setIsLoadingParques(false);
    }
  };

  const fetchBiodiversidade = async (bioId: number) => {
    try {
      const bio = await biodiversidadeService.getById(bioId);
      // Carregar imagens do localStorage
      const imagensSalvas = imageStorage.getBiodiversidadeImages(bioId);
      setFormData({
        especie: bio.especie,
        tipo: bio.tipo || '',
        descricao: bio.descricao || '',
        parque_id: bio.parque_id,
        imagens: imagensSalvas,
      });
    } catch (error) {
      toast.error('Erro ao carregar registro');
      navigate('/biodiversidades');
    } finally {
      setIsFetching(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`A imagem ${file.name} é muito grande. Máximo 5MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormData((prev) => ({
          ...prev,
          imagens: [...(prev.imagens || []), base64],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imagens: prev.imagens?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.parque_id === 0) {
      toast.error('Selecione um parque');
      return;
    }

    setIsLoading(true);

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
      }

      if (isEditing && id) {
        await biodiversidadeService.update(parseInt(id), dadosSemImagens);
        // Salvar imagens no localStorage
        const salvou = imageStorage.saveBiodiversidadeImages(parseInt(id), imagensComprimidas);
        if (!salvou) {
          toast.error('Erro ao salvar imagens. Espaço insuficiente.');
        }
        toast.success('Registro atualizado com sucesso!');
      } else {
        const novoRegistro = await biodiversidadeService.create(dadosSemImagens);
        // Salvar imagens no localStorage com o ID do novo registro
        if (novoRegistro && novoRegistro.id) {
          const salvou = imageStorage.saveBiodiversidadeImages(novoRegistro.id, imagensComprimidas);
          if (!salvou) {
            toast.error('Registro criado, mas houve erro ao salvar imagens.');
          }
        }
        toast.success('Registro criado com sucesso!');
      }
      navigate('/biodiversidades');
    } catch (error) {
      toast.error(isEditing ? 'Erro ao atualizar registro' : 'Erro ao criar registro');
    } finally {
      setIsLoading(false);
      toast.dismiss('compressing');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'parque_id' ? parseInt(value) : value 
    }));
  };

  if (isFetching || isLoadingParques) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (parques.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Leaf className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhum parque cadastrado</h2>
        <p className="text-gray-500 mb-6">Você precisa cadastrar pelo menos um parque antes de criar um registro de biodiversidade.</p>
        <button
          onClick={() => navigate('/parques/novo')}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Cadastrar Parque
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <button
        onClick={() => navigate('/biodiversidades')}
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Voltar
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Editar Registro' : 'Novo Registro'}
              </h1>
              <p className="text-gray-500 text-sm">
                {isEditing ? 'Atualize as informações da espécie' : 'Preencha os dados da nova espécie'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="especie" className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Espécie <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="especie"
              name="especie"
              value={formData.especie}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Ex: Araucária angustifolia"
            />
          </div>

          <div>
            <label htmlFor="parque_id" className="block text-sm font-medium text-gray-700 mb-2">
              Parque <span className="text-red-500">*</span>
            </label>
            <select
              id="parque_id"
              name="parque_id"
              value={formData.parque_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
            >
              <option value={0}>Selecione um parque</option>
              {parques.map((parque) => (
                <option key={parque.id} value={parque.id}>
                  {parque.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
            >
              <option value="">Selecione o tipo</option>
              <option value="Flora">Flora (Plantas)</option>
              <option value="Fauna">Fauna (Animais)</option>
            </select>
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
              placeholder="Descreva a espécie, características, habitat..."
            />
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagens da Espécie 
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
              onClick={() => navigate('/biodiversidades')}
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
                isEditing ? 'Salvar Alterações' : 'Criar Registro'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BiodiversidadeForm;
