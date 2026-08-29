
export interface User {
  id?: string;
  first: string;
  last: string;
  address: string;
  phone: string;
  email: string;
  jobType: string;
  price: number;
  stage: string;
  notes?: string;
  sortorder?: string;
  salesperson?: string;
  gdrive?: string;
  created_at?: Date;
}

export interface Note {
  note_id?: string;
  title?: string;
  content: string;
  customer_id: number;
  created_at?: Date;
}