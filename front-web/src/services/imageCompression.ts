// Serviço para comprimir imagens antes de salvar no localStorage
export const imageCompression = {
  // Comprimir imagem para reduzir tamanho
  compressImage: (base64Image: string, maxWidth: number = 800, quality: number = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = base64Image;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Não foi possível criar contexto do canvas'));
          return;
        }
        
        // Calcular novas dimensões mantendo proporção
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Desenhar imagem redimensionada
        ctx.drawImage(img, 0, 0, width, height);
        
        // Converter para JPEG com qualidade reduzida
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        
        console.log(`Imagem comprimida: ${base64Image.length} -> ${compressedBase64.length} (${Math.round((1 - compressedBase64.length / base64Image.length) * 100)}% redução)`);
        
        resolve(compressedBase64);
      };
      
      img.onerror = () => {
        reject(new Error('Erro ao carregar imagem para compressão'));
      };
    });
  },

  // Comprimir múltiplas imagens
  compressImages: async (images: string[], maxWidth: number = 800, quality: number = 0.7): Promise<string[]> => {
    const compressedImages: string[] = [];
    
    for (let i = 0; i < images.length; i++) {
      try {
        console.log(`Comprimindo imagem ${i + 1}/${images.length}...`);
        const compressed = await imageCompression.compressImage(images[i], maxWidth, quality);
        compressedImages.push(compressed);
      } catch (error) {
        console.error(`Erro ao comprimir imagem ${i + 1}:`, error);
        // Se falhar a compressão, usa a imagem original
        compressedImages.push(images[i]);
      }
    }
    
    return compressedImages;
  },

  // Limitar número de imagens
  limitImages: (images: string[], maxImages: number = 5): string[] => {
    if (images.length > maxImages) {
      console.warn(`Limitando de ${images.length} para ${maxImages} imagens`);
      return images.slice(0, maxImages);
    }
    return images;
  },

  // Processar imagens (comprimir + limitar)
  processImages: async (images: string[], maxImages: number = 5, maxWidth: number = 800, quality: number = 0.7): Promise<string[]> => {
    // Primeiro limita o número
    const limited = imageCompression.limitImages(images, maxImages);
    // Depois comprime
    return await imageCompression.compressImages(limited, maxWidth, quality);
  },

  // Verificar espaço disponível no localStorage (aproximado)
  getStorageInfo: () => {
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length * 2; // UTF-16 = 2 bytes por caractere
      }
    }
    return {
      used: (totalSize / 1024 / 1024).toFixed(2) + ' MB',
      usedBytes: totalSize,
      estimatedLimit: '5-10 MB',
      remaining: 'Desconhecido'
    };
  }
};

export default imageCompression;
