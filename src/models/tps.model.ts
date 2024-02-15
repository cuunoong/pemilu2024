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
  images: string[];
  psu: null;
  status_adm: boolean;
  status_suara: boolean;
  ts: string;
}
