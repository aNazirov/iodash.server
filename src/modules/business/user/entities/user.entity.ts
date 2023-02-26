export class User {
  id: number;
  name: string;
  contact: Contact;
  role: Role;
  balance?: number;
  activeBefore: Date;
}

export class Role {
  id: number;
  title: string;
}

export class Contact {
  email: string;
}
