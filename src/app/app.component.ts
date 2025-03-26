import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Data, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployeeService } from './services/employee.service';
import { EmployeeModel } from './models/employee.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  employeeForm: FormGroup = new FormGroup({});
  employeeList: EmployeeModel[] = [];
  selectedEmployee: EmployeeModel | null = null;
  employeeData: any[]=[];
  filteredEmployeeData: any[]=[];
  searchEmployee: string='';


  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.createForm();
  }
  loadEmployees(): void {
    this.employeeList = this.employeeService.getEmployees();
    this.employeeData = [...this.employeeList]; 
  }
  

  createForm() {
    this.employeeForm = new FormGroup({
      empId: new FormControl(null),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      emailId: new FormControl('', [Validators.required, Validators.email]),
      contactNo: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{11}$')]),
      city: new FormControl('', Validators.required),
      pincode: new FormControl('', [Validators.pattern('^[0-9]{5}$')]),
      address: new FormControl('', [Validators.minLength(10)])
    });
  }

  onSave() {
    if (this.employeeForm.valid) {
      this.employeeService.addEmployee(this.employeeForm.value);
      this.loadEmployees();
      this.createForm();
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }

  onEdit(employee: EmployeeModel) {
    this.selectedEmployee = employee;
    this.employeeForm.setValue({ ...employee });
  }

  onUpdate() {
    if (this.employeeForm.valid && this.selectedEmployee) {
      this.employeeService.updateEmployee(this.employeeForm.value);
      this.loadEmployees();
      this.selectedEmployee = null;
      this.createForm();
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }

  onDelete(empId: number) {
    this.employeeService.deleteEmployee(empId);
    this.loadEmployees();
  }
  searchEmployeeByName($event: Event) {
    const input = ($event.target as HTMLInputElement).value.toLowerCase();
  
    if (input) {
      this.employeeList = this.employeeData.filter(employee =>
        employee.name.toLowerCase().includes(input)
      );
    } else {
      this.loadEmployees(); 
    }
  }
  
  
}