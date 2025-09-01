import {
  Component,
  computed,
  EventEmitter,
  inject,
  Inject,
  Input,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { Ad } from '../../models/ad.model';
import { CommonModule } from '@angular/common';
import { AuthStore } from '../../stores/auth.store';
import { AdsStore } from '../../stores/ads.store';

@Component({
  selector: 'app-ad-card',
  imports: [CommonModule],
  templateUrl: './ad-card.component.html',
  styleUrl: './ad-card.component.scss',
})
export class AdCardComponent {
  authStore = inject(AuthStore);
  adStore = inject(AdsStore);
  @Input() ad!: Ad;
  @Input() isSelected = false;
  @Output() select = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  canEdit = computed(() => this.authStore.userId() === this.ad.userId);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  onClick() {
    this.select.emit();
  }

  editeAd() {
    this.edit.emit();
  }

  deleteAd() {
    this.adStore.deleteAd(this.ad.id).subscribe({
      next: () => {},
      error: (err) => {
        console.error('השמירה נכשלה', err);
      },
    });
  }
}
