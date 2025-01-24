export interface EnumValue {
    name: string;
    displayName: string;
  }
  
  export interface EnumResponse<T> {
    [key: string]: string;
  }

  export interface CategoryEnum extends EnumValue {}
  export interface GenreEnum extends EnumValue {}

  export class EnumMapper {
    static toEnumValues<T extends EnumValue>(response: EnumResponse<T> | null | undefined): T[] {
      if (!response) return [];
      
      return Object.entries(response).map(([name, displayName]) => ({
        name,
        displayName
      })) as T[];
    }

    static getDisplayName(enumValues: EnumValue[], name: string): string {
      return enumValues.find(value => value.name === name)?.displayName || name;
    }

    static getName(enumValues: EnumValue[], displayName: string): string {
      return enumValues.find(value => value.displayName === displayName)?.name || displayName;
    }
  }