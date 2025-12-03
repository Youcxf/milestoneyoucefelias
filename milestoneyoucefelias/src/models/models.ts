export interface DepartmentRequestModel{
    departmentName: string;
    departmentBuilding: number;
}

export interface DepartmentResponseModel{
    id: number;
    departmentName: string;
    departmentBuilding: number;
}

export interface DepartmentSummary{
    id: number;
    departmentName: string;
    departmentBuilding: number;
}

export interface ProfessorRequestModel{
    email: string;
    professorName: string;
    professorPhoneNumber: string;
    departmentId: number;
}

export interface ProfessorResponseModel{
    id: number;
    email: string;
    professorName: string;
    professorPhoneNumber: string;
    departmentId: number;
}

export interface ProfessorSummary{
    id: number;
    professorName: string;
    email: string;
}