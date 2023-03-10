import { Component, OnInit } from '@angular/core';
import { weatherType } from 'src/types/weatherType';
import { ForecastService } from '../forecast.service';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css'],
})
export class ForecastComponent implements OnInit {
  searchValue: string = '';
  mainDivClassList = 'closed';
  errorContainerClassList = 'invisible';
  currentWeatherData: weatherType | undefined = undefined;
  oneDayForecastData: weatherType | undefined = undefined;
  forecastIcon: string | undefined;

  constructor(private forecastSerice: ForecastService) {}

  ngOnInit(): void {}

  handleChange(e: any) {
    this.searchValue = e.target.value;
  }

  openMainDiv() {
    this.mainDivClassList = '';
  }
  closeMainDiv() {
    this.mainDivClassList = 'closed';
  }

  formatDate() {
    return this.currentWeatherData?.location.localtime.substring(
      0,
      this.currentWeatherData.location.localtime.length - 5
    );
  }

  closeMainDivEvent(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this.currentWeatherData = undefined;
      this.closeMainDiv();
    }
  }

  showErrorText() {
    this.errorContainerClassList = '';
    setTimeout(() => {
      this.errorContainerClassList = 'invisible';
    }, 2500);
  }

  async handleSearch(e: Event) {
    e.preventDefault();
    let currentResponse;
    let oneDayForecastResponse;
    if (this.searchValue !== null && this.searchValue !== '') {
      currentResponse = await this.forecastSerice.getCurrentWeather(this.searchValue);
      oneDayForecastResponse = await this.forecastSerice.getForecastOneDay(this.searchValue);
      if (currentResponse === 'error') {
        this.showErrorText();
        return;
      }
      this.currentWeatherData = currentResponse;
      this.oneDayForecastData = oneDayForecastResponse;
      console.log(this.oneDayForecastData);
      
      let condition = this.currentWeatherData?.current.condition;
      if (condition !== undefined) {
        this.forecastIcon = this.forecastSerice.returnWeatherIcon(condition);
      }
      console.log(this.currentWeatherData);
      console.log(this.forecastIcon);

      this.openMainDiv();
    }
  }
}
