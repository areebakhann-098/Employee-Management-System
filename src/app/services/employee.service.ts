import { Injectable } from '@angular/core';
import { EmployeeModel } from '../models/employee.model';


@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private storageKey = 'EmpData';

  constructor() {}

  getEmployees(): EmployeeModel[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

 
  getEmployeeById(empId: number): EmployeeModel | undefined {
    return this.getEmployees().find(emp => emp.empId === empId);
  }

  addEmployee(employee: EmployeeModel): void {
    const employees = this.getEmployees();
    employee.empId = employees.length + 1; 
    employees.unshift(employee);
    this.saveToLocalStorage(employees);
  }


  updateEmployee(updatedEmployee: EmployeeModel): void {
    let employees = this.getEmployees();
    employees = employees.map(emp =>
      emp.empId === updatedEmployee.empId ? updatedEmployee : emp
    );
    this.saveToLocalStorage(employees);
  }


  deleteEmployee(empId: number): void {
    const employees = this.getEmployees().filter(emp => emp.empId !== empId);
    this.saveToLocalStorage(employees);
  }


  private saveToLocalStorage(employees: EmployeeModel[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(employees));
  }
}
