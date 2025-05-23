// API Request and Response Types

export interface CompanyBrowseRequest {
  SqlUserName: string;
  SqlPassword: string;
  Server: string | null;
  Database: string | null;
  DbUserName: string | null;
  StateSelector: number;
  EmployeeID: number | null;
  ContractSelector: number;
  CompanyStatusSelector: number;
  CompanyStatusID: number | null;
  View: number;
  ShowMine: boolean;
  ShowOnlyOpen: boolean;
}

export interface Company {
  Id: number;
  Class: number;
  State: number;
  Flag: number;
  FileAs: string;
  FoundationDate: string | null;
  LegalName: string;
  KPP: string | null;
  LegalCode: string | null;
  BankAccountId: number | null;
  ExecutiveEmployeeId: number | null;
  AccountantEmployeeId: number | null;
  ManagerEmployeeId: number | null;
  CompanySizeId: number | null;
  CompanyTurnoverId: number | null;
  CompanyStatusId: number | null;
  Comments: string | null;
  DdmOperatorCode: string | null;
  DdmParticipantCode: string | null;
  Created: string;
  CreatedBy: number;
  Modified: string;
  ModifiedBy: number;
  Timestamp: string;
  ApplyVAT: boolean;
  Number: string | null;
  Phone1: string | null;
  Phone2: string | null;
  Street: string | null;
  Street2: string | null;
  Country: string | null;
  Country2: string | null;
  Region: string | null;
  Region2: string | null;
  City: string | null;
  City2: string | null;
  PostalCode: string | null;
  PostalCode2: string | null;
  Email: string | null;
  WebPage: string | null;
  Private: boolean;
  "#PhoneType#1": string | null;
  "#PhoneType#2": string | null;
  "#PhoneType#3": string | null;
  "#PhoneType#4": string | null;
  "#PhoneType#5": string | null;
  "#PhoneType#6": string | null;
  "#PhoneType#7": string | null;
  "#PhoneType#8": string | null;
  "#PhoneType#9": string | null;
  "#PhoneType#10": string | null;
  "#PhoneType#11": string | null;
  ParentCompanyId: number | null;
  Categories: string;
  Industries: string;
  Bin: string | null;
}

export interface Property {
  Id: number;
  Name: string;
  Type: string;
  Format: string;
  BuiltIn: boolean;
  Description: string | null;
  Guid: string;
  Visible: boolean;
}

export interface PropertyValue {
  PropertyId: number;
  DocumentId: number;
  Value: string;
}

export interface CompanyBrowseResponse {
  Companies: Company[];
  Properties: Property[];
  PropertyValues: PropertyValue[];
} 