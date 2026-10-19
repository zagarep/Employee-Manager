
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../services/employee';
@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './employees.html',
  styleUrl: './employees.css'
})
export class Employees {
  fullName: string = '';
  email: string = '';
  department: string = '';
  salary: number = 0;
  editEmployeeId: number | null = null;

  employees: any[] = [];

  constructor(
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef
  ) {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        console.log('Employees loaded:', data);

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading employees:', error);
      }
    });
  }

  editEmployee(emp: any) {
    this.editEmployeeId = emp.id;

    this.fullName = emp.fullName;
    this.email = emp.email;
    this.department = emp.department;
    this.salary = emp.salary;
  }


  addEmployee() {
    const employee = {
      fullName: this.fullName,
      email: this.email,
      department: this.department,
      salary: this.salary
    };

    if (this.editEmployeeId !== null) {
      // Update existing employee
      this.employeeService.updateEmployee(
        this.editEmployeeId,
        employee
      ).subscribe({
        next: () => {
          console.log('Employee updated successfully');

          this.resetForm();
          this.loadEmployees();
        },
        error: (error) => {
          console.error('Error updating employee:', error);
        }
      });
    } else {
      // Add new employee
      this.employeeService.createEmployee(employee).subscribe({
        next: () => {
          console.log('Employee added successfully');

          this.resetForm();
          this.loadEmployees();
        },
        error: (error) => {
          console.error('Error adding employee:', error);
        }
      });
    }
  }

  resetForm() {
    this.editEmployeeId = null;
    this.fullName = '';
    this.email = '';
    this.department = '';
    this.salary = 0;
  }

  deleteEmployee(id: number) {
    if (!confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        console.log('Employee deleted successfully');
        this.loadEmployees();
      },
      error: (error) => {
        console.error('Error deleting employee:', error);
      }
    });
  }


}
