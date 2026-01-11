const { v4: uuidv4 } = require('uuid');

class User {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.phone = data.phone;
    this.role = data.role || 'User';
    this.status = data.status || 'Active';
    this.department = data.department;
    this.location = data.location;
    this.joinDate = data.joinDate || new Date().toISOString().split('T')[0];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

// In-memory database
let users = [
  new User({
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '+1-555-0101',
    role: 'Admin',
    status: 'Active',
    department: 'Engineering',
    location: 'New York, USA',
    joinDate: '2023-01-15'
  }),
  new User({
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@company.com',
    phone: '+1-555-0102',
    role: 'Manager',
    status: 'Active',
    department: 'Marketing',
    location: 'San Francisco, USA',
    joinDate: '2023-03-20'
  }),
  new User({
    id: '3',
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@company.com',
    phone: '+1-555-0103',
    role: 'User',
    status: 'Inactive',
    department: 'Sales',
    location: 'Chicago, USA',
    joinDate: '2022-11-10'
  })
];

class UserModel {
  static getAll() {
    return users;
  }

  static getById(id) {
    return users.find(u => u.id === id);
  }

  static create(userData) {
    const user = new User(userData);
    users.push(user);
    return user;
  }

  static update(id, userData) {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;
    
    users[index] = new User({ ...users[index], ...userData, id });
    return users[index];
  }

  static delete(id) {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;
    
    users.splice(index, 1);
    return true;
  }

  static search(query) {
    const lowerQuery = query.toLowerCase();
    return users.filter(u => 
      u.firstName.toLowerCase().includes(lowerQuery) ||
      u.lastName.toLowerCase().includes(lowerQuery) ||
      u.email.toLowerCase().includes(lowerQuery) ||
      u.department.toLowerCase().includes(lowerQuery)
    );
  }

  static filter(filters) {
    return users.filter(u => {
      if (filters.role && u.role !== filters.role) return false;
      if (filters.status && u.status !== filters.status) return false;
      if (filters.department && u.department !== filters.department) return false;
      return true;
    });
  }
}

module.exports = UserModel;