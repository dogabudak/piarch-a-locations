import * as countriesData from 'countries-list';
import * as citiesData from 'cities-list';

export interface Country {
  name: string;
  code: string;
  capital?: string;
  native?: string;
}

export interface City {
  name: string;
  countryCode: string;
}

export class CountryCityService {
  private static instance: CountryCityService;
  private countriesList: Country[] = [];
  private citiesList: City[] = [];

  private constructor() {
    this.initializeData();
  }

  public static getInstance(): CountryCityService {
    if (!CountryCityService.instance) {
      CountryCityService.instance = new CountryCityService();
    }
    return CountryCityService.instance;
  }

  private initializeData(): void {
    // Convert countries object to array format
    this.countriesList = Object.entries(countriesData.countries).map(([code, country]: [string, any]) => ({
      name: country.name,
      code: code.toUpperCase(),
      capital: country.capital,
      native: country.native
    }));

    // Convert cities object to array format
    this.citiesList = Object.entries(citiesData).map(([name, countryCode]: [string, any]) => ({
      name: name,
      countryCode: countryCode
    }));
  }

  public getAllCountries(): Country[] {
    return this.countriesList.sort((a, b) => a.name.localeCompare(b.name));
  }

  public getCountryByCode(code: string): Country | undefined {
    return this.countriesList.find(country => 
      country.code.toLowerCase() === code.toLowerCase()
    );
  }

  public getCountryByName(name: string): Country | undefined {
    return this.countriesList.find(country => 
      country.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  public getCitiesByCountry(countryCode: string): City[] {
    return this.citiesList
      .filter(city => city.countryCode.toLowerCase() === countryCode.toLowerCase())
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  public getCitiesByCountryName(countryName: string): City[] {
    const country = this.getCountryByName(countryName);
    if (!country) return [];
    
    return this.getCitiesByCountry(country.code);
  }

  public searchCities(query: string, limit: number = 10): City[] {
    return this.citiesList
      .filter(city => 
        city.name.toLowerCase().includes(query.toLowerCase()) ||
        city.countryCode.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, limit)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  public getCitiesByCountryCode(countryCode: string): City[] {
    return this.citiesList
      .filter(city => 
        city.countryCode.toLowerCase() === countryCode.toLowerCase()
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }
} 