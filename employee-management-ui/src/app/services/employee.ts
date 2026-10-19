
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = 'http://localhost:5230/api/Employees';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiUrl,
      { headers: this.getHeaders() }
    );
  }

  createEmployee(employee: any): Observable<any> {
    return this.http.post<any>(
      this.apiUrl,
      employee,
      { headers: this.getHeaders() }
    );
  }

  updateEmployee(id: number, employee: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      employee,
      { headers: this.getHeaders() }
    );
  }

  deleteEmployee(id: number): Observable<string> {
    return this.http.delete(
      `${this.apiUrl}/${id}`,
      {
        headers: this.getHeaders(),
        responseType: 'text'
      }
    );
  }
}
