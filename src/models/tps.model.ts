export class TPSModel {
  administrasi?: {
    pemilih_dpt_j: number;
    pemilih_dpt_l: number;
    pemilih_dpt_p: number;
    pengguna_dpt_j: number;
    pengguna_dpt_l: number;
    pengguna_dpt_p: number;
    pengguna_dptb_j: number;
    pengguna_dptb_l: number;
    pengguna_dptb_p: number;
    pengguna_non_dpt_j: number;
    pengguna_non_dpt_l: number;
    pengguna_non_dpt_p: number;
    pengguna_total_j: number;
    pengguna_total_l: number;
    pengguna_total_p: number;
    suara_sah: number;
    suara_tidak_sah: number;
    suara_total: number;
  };
  chart?: { 100025: number; 100026: number; 100027: number };
  images?: string[] | null[];
  psu?: null;
  status_adm?: boolean;
  status_suara?: boolean;
  ts?: string;

  fetched?: boolean;
  valid?: boolean;

  validate() {
    this.fetched = !!(
      this.administrasi &&
      this.images?.filter((v) => !!v).length &&
      this.chart &&
      // this.psu &&
      this.ts
    );

    const suara = this.administrasi
      ? this.administrasi.suara_sah + this.administrasi.suara_tidak_sah ==
        this.administrasi.suara_total
      : false;

    const pemilih = this.administrasi
      ? this.administrasi.pemilih_dpt_p + this.administrasi.pemilih_dpt_l ==
        this.administrasi.pemilih_dpt_j
      : false;

    const dpt = this.administrasi
      ? this.administrasi.pengguna_dpt_p + this.administrasi.pengguna_dpt_l ==
        this.administrasi.pengguna_dpt_j
      : false;

    const dptb = this.administrasi
      ? this.administrasi.pengguna_dptb_l + this.administrasi.pengguna_dptb_p ==
        this.administrasi.pengguna_dptb_j
      : false;

    const non_dpt = this.administrasi
      ? this.administrasi.pengguna_dpt_l + this.administrasi.pengguna_dpt_p ==
        this.administrasi.pengguna_dpt_j
      : false;

    const pengguna = this.administrasi
      ? this.administrasi.pengguna_total_l +
          this.administrasi.pengguna_total_p ==
        this.administrasi.pengguna_total_j
      : false;

    const jumlah_suara = !this.chart
      ? 0
      : this.chart[100025] + this.chart[100026] + this.chart[100027];

    const perolehan = this.chart
      ? jumlah_suara == this.administrasi?.suara_sah
      : false;

    const pengguna_total = this.administrasi
      ? this.administrasi.pengguna_dpt_j +
          this.administrasi.pengguna_dptb_j +
          this.administrasi.pengguna_non_dpt_j ==
          this.administrasi.pengguna_total_j &&
        this.administrasi.pengguna_total_j == this.administrasi.suara_total
      : false;

    this.valid =
      this.fetched &&
      this.status_adm &&
      this.status_suara &&
      suara &&
      pemilih &&
      dpt &&
      dptb &&
      non_dpt &&
      pengguna &&
      perolehan &&
      pengguna_total;
  }

  fill(data: TPSModel) {
    this.administrasi = data.administrasi;
    this.chart = data.chart;
    this.fetched = data.fetched;
    this.images = data.images;
    this.psu = data.psu;
    this.status_adm = data.status_adm;
    this.status_suara = data.status_suara;
    this.ts = data.ts;
    this.valid = data.valid;
    return this;
  }
}
