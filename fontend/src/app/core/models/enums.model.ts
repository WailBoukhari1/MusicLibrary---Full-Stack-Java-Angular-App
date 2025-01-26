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
    static getDisplayName(enumValues: EnumValue[], name: string): string {
      return enumValues.find(value => value.name === name)?.displayName || name;
    }

    static getName(enumValues: EnumValue[], displayName: string): string {
      return enumValues.find(value => value.displayName === displayName)?.name || displayName;
    }

    static toEnumValues(values: any[]): EnumValue[] {
      return values.map(value => ({
        name: value.name,
        displayName: value.displayName
      }));
    }
  }