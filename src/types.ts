interface BasicProductDetails {
  name: string | undefined;
  price: string | undefined;
  url: string | null;
}

interface ProductDetail extends BasicProductDetails {
  description: string;
  variations: string[];
  imageUrl: string;
}

export { BasicProductDetails, ProductDetail };
