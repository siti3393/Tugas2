var trackingApp = new Vue({
  el: "#trackingApp",
  data: {
    pengirimanList: app.pengirimanList,
    paket: app.paket,
    tracking: app.tracking,
    form: {
      nim: "",
      nama: "",
      ekspedisi: "",
      paket: "",
      tanggalKirim: "",
    },
    nextDoNumber: Object.keys(app.tracking).length + 1,
    showDetailModal: false,
    selectedDO: {
      nomor: "",
      data: {
        nim: "",
        nama: "",
        paket: "",
        ekspedisi: "",
        total: 0,
        status: "",
        tanggalKirim: "",
        perjalanan: [],
      },
    },
    totalHarga: 0,
    selectedPaket: {},
  },
  computed: {
    nomorDO() {
      return `DO2025-${this.nextDoNumber.toString().padStart(4, "0")}`;
    },
  },
  watch: {
    "form.paket"(newVal) {
      if (newVal) {
        const selected = this.paket.find((p) => p.kode === newVal);
        this.selectedPaket = selected || {};
        this.totalHarga = this.selectedPaket.harga || 0;
        console.log("Paket dipilih:", newVal);
      }
    },
    "form.ekspedisi"(newVal) {
      if (newVal) {
        console.log("Ekspedisi dipilih:", newVal);
      }
    },
  },
  methods: {
    formatRupiah(value) {
      return "Rp " + value.toLocaleString("id-ID") + ",-";
    },
    formatTanggal(tanggal) {
      const date = new Date(tanggal);
      const options = { year: "numeric", month: "long", day: "numeric" };
      return date.toLocaleDateString("id-ID", options);
    },
    getEkspedisiName(kode) {
      const eks = this.pengirimanList.find((e) => e.kode === kode);
      return eks ? eks.nama : kode;
    },
    getStatusClass(status) {
      if (status.includes("Proses")) return "status-badge status-proses";
      if (status.includes("Perjalanan")) return "status-badge status-kirim";
      if (status.includes("Sampai") || status.includes("Diterima"))
        return "status-badge status-sampai";
      return "status-badge status-proses";
    },
    resetForm() {
      this.form = {
        nim: "",
        nama: "",
        ekspedisi: "",
        paket: "",
        tanggalKirim: "",
      };
    },
    simpanDO() {
      //=== Validasi ===
      if (!this.form.nim.trim() || !this.form.nama.trim()) {
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: "NIM dan Nama wajib diisi!",
        });
        return;
      }
      if (!this.form.ekspedisi) {
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: "Pilih ekspedisi pengiriman!",
        });
        return;
      }
      if (!this.form.paket) {
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: "Pilih paket bahan ajar!",
        });
        return;
      }
      if (!this.form.tanggalKirim) {
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: "Tanggal kirim wajib diisi!",
        });
        return;
      }

      const nomor = this.nomorDO;
      const selectedPaket = this.paket.find((p) => p.kode === this.form.paket);
      const selectedEkspedisi = this.pengirimanList.find(
        (e) => e.kode === this.form.ekspedisi
      );

      //=== Tambahkan ke tracking ===
      this.$set(this.tracking, nomor, {
        nim: this.form.nim,
        nama: this.form.nama,
        ekspedisi: this.form.ekspedisi,
        paket: selectedPaket.nama,
        total: selectedPaket.harga,
        status: "Dalam Proses",
        tanggalKirim: this.form.tanggalKirim,
        perjalanan: [
          {
            waktu: `${this.form.tanggalKirim} 08:00:00`,
            keterangan: "Pesanan diterima oleh sistem",
          },
        ],
      });

      this.nextDoNumber++;

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        html: `Delivery Order <strong>${nomor}</strong> berhasil ditambahkan.`,
        timer: 2000,
        showConfirmButton: false,
      });

      this.resetForm();
    },
    openDetailModal(nomor, data) {
      this.selectedDO = {
        nomor: nomor,
        data: data,
      };
      this.showDetailModal = true;
    },
    closeDetailModal() {
      this.showDetailModal = false;
    },
  },
});
