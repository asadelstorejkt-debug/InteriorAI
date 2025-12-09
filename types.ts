export interface ShoppingItem {
  itemName: string;
  category: string;
  recommendation: string; // Color/Material
  estimatedPrice: string;
}

export interface AnalysisResult {
  designStyle: string;
  description: string;
  shoppingList: ShoppingItem[];
}

export enum UploadStatus {
  IDLE,
  ANALYZING,
  SUCCESS,
  ERROR
}
