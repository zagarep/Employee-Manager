
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'https://localhost:7097/api/Employees';

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createEmployee(employee: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, employee);
  }

  updateEmployee(id: number, employee: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      employee
    );
  }

  deleteEmployee(id: number): Observable<string> {
    return this.http.delete(
      `${this.apiUrl}/${id}`,
      { responseType: 'text' }
    );
  }
}
