var stokApp = new Vue({
  el: "#stokApp",
  data: {
    bahanAjar: app.stok,
    filterUPBJJ: "",
    filterKategori: "",
    filterStatus: "",
    sortBy: "",
    upbjjList: app.upbjjList,
    kategoriList: app.kategoriList,
    filteredKategoriList: [],

    // Modal State
    showModal: false,
    modalMode: "add", // 'add' atau 'edit'
    form: {
      kode: "",
      judul: "",
      kategori: "",
      upbjj: "",
      lokasiRak: "",
      harga: 0,
      qty: 0,
      safety: 0,
      catatanHTML: "",
    },
  },

  computed: {
    filteredKategoriList() {
      if (!this.filterUPBJJ) return [];
      const kategoriSet = new Set(
        this.bahanAjar
          .filter((item) => item.upbjj === this.filterUPBJJ)
          .map((item) => item.kategori)
      );
      return Array.from(kategoriSet);
    },

    filteredData() {
      let data = this.bahanAjar;

      if (this.filterUPBJJ) {
        data = data.filter((item) => item.upbjj === this.filterUPBJJ);
      }
      if (this.filterKategori) {
        data = data.filter((item) => item.kategori === this.filterKategori);
      }
      if (this.filterStatus) {
        data = data.filter(
          (item) => this.getStatus(item) === this.filterStatus
        );
      }

      if (this.sortBy === "judul") {
        data = data.slice().sort((a, b) => a.judul.localeCompare(b.judul));
      } else if (this.sortBy === "stok") {
        data = data.slice().sort((a, b) => b.qty - a.qty);
      } else if (this.sortBy === "harga") {
        data = data.slice().sort((a, b) => b.harga - a.harga);
      }

      return data;
    },
  },

  watch: {
    filterUPBJJ(newVal) {
      if (!newVal) {
        this.filteredKategoriList = [];
        this.filterKategori = "";
      } else {
        const kategoriSet = new Set(
          this.bahanAjar
            .filter((item) => item.upbjj === newVal)
            .map((item) => item.kategori)
        );
        this.filteredKategoriList = Array.from(kategoriSet);
        this.filterKategori = ""; // reset kategori biar gak nyangkut dari filter sebelumnya
      }
    },
  },

  methods: {
    getStatus(item) {
      if (item.qty === 0) return "Kosong";
      if (item.qty < item.safety) return "Menipis";
      return "Aman";
    },
    getStatusClass(item) {
      if (item.qty === 0) return "status-kosong";
      if (item.qty < item.safety) return "status-menipis";
      return "status-aman";
    },
    resetFilter() {
      this.filterUPBJJ = "";
      this.filterKategori = "";
      this.filterStatus = "";
      this.sortBy = "";
    },

    // === Modal Functionality ===
    openModal(mode, item = null) {
      this.modalMode = mode;
      if (mode === "edit" && item) {
        this.form = Object.assign({}, item);
      } else {
        this.resetForm();
      }
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
    },

    resetForm() {
      this.form = {
        kode: "",
        judul: "",
        kategori: "",
        upbjj: "",
        lokasiRak: "",
        harga: 0,
        qty: 0,
        safety: 0,
        catatanHTML: "",
      };
    },

    saveBahanAjar() {
      // Validasi kolom wajib
      if (!this.form.kode.trim()) {
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: "Kode bahan ajar wajib diisi!",
        });
        return;
      }
      if (!this.form.judul.trim()) {
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: "Judul bahan ajar wajib diisi!",
        });
        return;
      }
      if (!this.form.kategori) {
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: "Kategori bahan ajar wajib dipilih!",
        });
        return;
      }
      if (!this.form.upbjj) {
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: "UPBJJ wajib dipilih!",
        });
        return;
      }
      if (!this.form.lokasiRak.trim()) {
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: "Lokasi rak wajib diisi!",
        });
        return;
      }

      // Validasi angka
      if (this.form.safety === null || this.form.safety < 0) {
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: "Safety stock tidak boleh minus!",
        });
        return;
      }
      if (this.form.qty === null || this.form.qty < 0) {
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: "Stok (qty) tidak boleh minus!",
        });
        return;
      }
      if (this.form.harga === null || this.form.harga <= 0) {
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: "Harga harus lebih dari 0!",
        });
        return;
      }

      // Cek duplikasi kode saat tambah
      if (this.modalMode === "add") {
        const exists = this.bahanAjar.some((x) => x.kode === this.form.kode);
        if (exists) {
          Swal.fire({
            icon: "error",
            title: "Duplikat!",
            text: "Kode bahan ajar sudah ada!",
          });
          return;
        }
        this.bahanAjar.push({ ...this.form });
      } else if (this.modalMode === "edit") {
        const index = this.bahanAjar.findIndex(
          (x) => x.kode === this.form.kode
        );
        if (index !== -1) {
          Vue.set(this.bahanAjar, index, { ...this.form });
        }
      }

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text:
          this.modalMode === "add"
            ? "Bahan ajar ditambahkan."
            : "Bahan ajar diperbarui.",
        timer: 1500,
        showConfirmButton: false,
      });

      this.closeModal();
    },
  },
});
