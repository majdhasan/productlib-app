export const getTranslation = (product: any, language: string) => {
    const translation = product.translations.find((t: any) => t.language === language);
    return translation || { name: product.name, description: product.description };
  };