import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Map, X, ImagePlus } from 'lucide-react';
import { trilhaService, parqueService } from '../services/api';
import { imageCompression } from '../services/imageCompression';
import { TrilhaCreate, Parque } from '../types';
import toast from 'react-hot-toast';

const TrilhaForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<TrilhaCreate>({
    nome: '',
    dificuldade: '',
    distancia: undefined,
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
      fetchTrilha(parseInt(id));
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

  const fetchTrilha = async (trilhaId: number) => {
    try {
      const trilha = await trilhaService.getById(trilhaId);
      setFormData({
        nome: trilha.nome,
        dificuldade: trilha.dificuldade || '',
        distancia: trilha.distancia,
        parque_id: trilha.parque_id,
        imagens: trilha.imagens || [],
      });
    } catch (error) {
      toast.error('Erro ao carregar trilha');
      navigate('/admin/trilhas');
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
      // Comprimir imagens antes de enviar
      let imagensComprimidas: string[] = [];
      if (formData.imagens && formData.imagens.length > 0) {
        toast.loading('Comprimindo imagens...', { id: 'compressing' });
        imagensComprimidas = await imageCompression.processImages(formData.imagens, 5, 800, 0.7);
        toast.dismiss('compressing');
      }

      const dataToSend = {
        ...formData,
        imagens: imagensComprimidas,
        distancia: formData.distancia ? Number(formData.distancia) : undefined,
      };

      if (isEditing && id) {
        await trilhaService.update(parseInt(id), dataToSend);
        toast.success('Trilha atualizada com sucesso!');
      } else {
        await trilhaService.create(dataToSend);
        toast.success('Trilha criada com sucesso!');
      }
      navigate('/admin/trilhas');
    } catch (error) {
      toast.error(isEditing ? 'Erro ao atualizar trilha' : 'Erro ao criar trilha');
    } finally {
      setIsLoading(false);
      toast.dismiss('compressing');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'parque_id' ? parseInt(value) : value 
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: value === '' ? undefined : parseFloat(value) 
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
        <Map className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhum parque cadastrado</h2>
        <p className="text-gray-500 mb-6">Você precisa cadastrar pelo menos um parque antes de criar uma trilha.</p>
        <button
          onClick={() => navigate('/admin/parques/novo')}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Cadastrar Parque
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/admin/trilhas')}
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Voltar
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Map className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Editar Trilha' : 'Nova Trilha'}
              </h1>
              <p className="text-gray-500 text-sm">
                {isEditing ? 'Atualize as informações da trilha' : 'Preencha os dados da nova trilha'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Trilha <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Ex: Trilha das Cachoeiras"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="dificuldade" className="block text-sm font-medium text-gray-700 mb-2">
                Dificuldade
              </label>
              <select
                id="dificuldade"
                name="dificuldade"
                value={formData.dificuldade}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
              >
                <option value="">Selecione</option>
                <option value="Fácil">Fácil</option>
                <option value="Moderada">Moderada</option>
                <option value="Difícil">Difícil</option>
                <option value="Leve">Leve</option>
                <option value="Pesada">Pesada</option>
              </select>
            </div>

            <div>
              <label htmlFor="distancia" className="block text-sm font-medium text-gray-700 mb-2">
                Distância (km)
              </label>
              <input
                type="number"
                id="distancia"
                name="distancia"
                value={formData.distancia || ''}
                onChange={handleNumberChange}
                step="0.1"
                min="0"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Ex: 5.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagens da Trilha
              {formData.imagens && formData.imagens.length > 0 && (
                <span className="text-primary-600 ml-2">({formData.imagens.length} imagens)</span>
              )}
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Máximo 5 imagens. Serão comprimidas automaticamente.
            </p>
            
            {formData.imagens && formData.imagens.length > 0 && (
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
            )}

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
              onClick={() => navigate('/admin/trilhas')}
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
                isEditing ? 'Salvar Alterações' : 'Criar Trilha'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrilhaForm;
