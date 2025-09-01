import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Ad } from '../../models/ad.model';
import { AdsService } from '../../services/ad.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AD_TYPES } from '../../consts/types';
import { AuthStore } from '../../stores/auth.store';
import { AdsStore } from '../../stores/ads.store';

@Component({
  selector: 'app-ad-details.component',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './ad-details.component.html',
  styleUrl: './ad-details.component.scss',
})
export class AdDetailsComponent {
  authStore = inject(AuthStore);
  adsStore = inject(AdsStore);
  ad!: Ad;
  form: FormGroup;
  types = AD_TYPES.map((c, i) => ({ id: i, name: c }));;

  title = 'מודעה חדשה';

  constructor(
    private fb: FormBuilder,
    private adsService: AdsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      type: 'כללי',
      title: [''],
      description: [''],
      location: [''],
      image: [''],
      price: [''],
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.adsService.getAd(+id).subscribe((a) => {
        this.ad = a;

        this.form = this.fb.group({
          type: [this.ad.type],
          title: [this.ad.title],
          description: [this.ad.description],
          location: [this.ad.location],
          image: [this.ad.image],
          price: [this.ad.price],
        });
        this.title = 'עדכון מודעה';
      });
    }
  }
  ngOnChanges() {
    if (this.ad) {
      this.form.patchValue(this.ad);
    }
  }

  save() {
    if (this.form.valid) {
      const updatedAd: Ad = { ...this.ad, ...this.form.value };
      if (this.ad && this.ad.id) {
        this.adsStore.updateAd(updatedAd).subscribe({
          next: () => {
            this.router.navigate(['/']);
          },
          error: (err) => {
            console.error('השמירה נכשלה', err);
          },
        });
      } else {
        updatedAd.userId = this.authStore.userId()!;
        this.adsStore.addAd(updatedAd).subscribe({
          next: () => {
            this.router.navigate(['/']);
          },
          error: (err) => {
            console.error('השמירה נכשלה', err);
          },
        });
      }
    }
  }

onFileSelected(event: any) {
  const file: File = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.form.patchValue({ image: base64 });
      if (this.ad) {
        this.ad.image = base64;
      }
    };
    reader.readAsDataURL(file);
  }
}


  abort() {
    this.router.navigate(['/']);
  }
}
