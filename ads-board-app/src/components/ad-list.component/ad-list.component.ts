import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ad } from '../../models/ad.model';
import { AdCardComponent } from '../ad-card.component/ad-card.component';
import { AuthStore } from '../../stores/auth.store';
import { AdsStore } from '../../stores/ads.store';

@Component({
  selector: 'app-ad-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AdCardComponent],
  templateUrl: './ad-list.component.html',
  styleUrl: './ad-list.component.scss',
})
export class AdListComponent {
  authStore = inject(AuthStore);
  adsStore = inject(AdsStore);

  ads: Ad[] = this.adsStore.filteredAds();
  filterdAds = [...this.ads];

  selectedAdId: number | null = null;
  searchTerm: string = '';
  showLogin = false;

  canAddedNew = computed(() => this.authStore.isLoggedIn());
  constructor(
    private router: Router
  ) {}

  onSearchChange() {
  this.adsStore.setSearch(this.searchTerm); 
  
}

  selectAd(adId: number) {
    this.selectedAdId = adId;
  }

  ngOnInit() {
    this.adsStore.getAllAds();
  }

  addNewAd() {
    this.router.navigate(['/ads/new']);
  }

  editAd(id: number) {
    this.router.navigate(['/ads', id, 'edit']);
  }

  login() {
    this.router.navigate(['/login']);
  }
}
