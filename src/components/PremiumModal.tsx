import React, { useState } from 'react';
import { X, Sparkles, Check, CreditCard, Gift, ShieldAlert, User, Mail, Lock, ShieldCheck } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmUpgrade: () => void;
}

export default function PremiumModal({ isOpen, onClose, onConfirmUpgrade }: PremiumModalProps) {
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');
  
  // Register Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  
  // Login Fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Promo
  const [promoCode, setPromoCode] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const benefits = [
    'Akses penuh seluruh 30 rekomendasi pariwisata premium Bangka & Belitung',
    'Asisten Pintar NatakAI Travel Bot Personal yang responsif',
    'Rute Planner Itinerary: Skema Wisata Seharian (Full Day) / Setengah Hari',
    'Rincian Istimewa: Keunikan Lokal, Akses Navigasi, & Waktu Jam Buka Terbaik',
    'Biaya Keanggotaan super terjangkau: Hanya Rp 29.000 untuk 3 Bulan akses VIP'
  ];

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'BABELBEBAS' || promoCode.trim().toUpperCase() === 'DISCOUNT') {
      setIsSubmitting(true);
      setErrorMsg('');
      setSuccessMsg('Kupon berhasil diklaim! Mengaktifkan Premium Gratis...');
      setTimeout(() => {
        setIsSubmitting(false);
        localStorage.setItem('localtrip_current_user', JSON.stringify({ name: 'Pengguna Kupon', email: 'coupon@babel.com' }));
        onConfirmUpgrade();
        setSuccessMsg('');
      }, 1200);
    } else {
      setErrorMsg('Kode kupon salah! Coba gunakan kode kupon "BABELBEBAS" untuk akses demo gratis.');
    }
  };

  // ✅ REGISTER — terhubung ke backend API
  const handleRegisterAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('Harap masukkan Nama Lengkap Anda.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Harap masukkan alamat Email yang valid.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Sandi/Kata Sandi minimal harus terdiri dari 6 karakter.');
      return;
    }
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 12) {
      setErrorMsg('Harap masukkan nomor kartu debit/kredit simulasi yang valid (min. 12 digit).');
      return;
    }
    if (!expiry || !expiry.includes('/')) {
      setErrorMsg('Harap isi Masa Berlaku kartu (MM/YY) dengan benar.');
      return;
    }
    if (!cvv || cvv.length < 3) {
      setErrorMsg('Harap isi 3 digit nomor CVV/CVC di belakang kartu.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name.trim(), email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || 'Registrasi gagal. Coba lagi.');
        setIsSubmitting(false);
        return;
      }

      // ✅ Simpan token & data user ke localStorage
      localStorage.setItem('nataktrip_token', data.token);
      localStorage.setItem('localtrip_current_user', JSON.stringify({ name: data.data.username, email: data.data.email, id: data.data.id, status: data.data.status }));

      // Upgrade ke Premium setelah "pembayaran" simulasi
      await fetch(`${API_URL}/users/${data.data.id}/upgrade`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      setIsSubmitting(false);
      setSuccessMsg(`Pendaftaran & Pembayaran Berhasil! Selamat datang, ${data.data.username}.`);

      setTimeout(() => {
        onConfirmUpgrade();
        setSuccessMsg('');
        setName(''); setEmail(''); setPassword('');
        setCardNumber(''); setExpiry(''); setCvv('');
      }, 1200);

    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg('Tidak dapat terhubung ke server. Pastikan backend berjalan.');
    }
  };

  // ✅ LOGIN — terhubung ke backend API
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginEmail.trim() || !loginEmail.includes('@')) {
      setErrorMsg('Harap masukkan Email yang valid.');
      return;
    }
    if (!loginPassword) {
      setErrorMsg('Harap masukkan sandi Anda.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail.trim(), password: loginPassword }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || 'Email atau password salah.');
        setIsSubmitting(false);
        return;
      }

      // ✅ Simpan token & data user ke localStorage
      localStorage.setItem('nataktrip_token', data.token);
      localStorage.setItem('localtrip_current_user', JSON.stringify({ name: data.data.username, email: data.data.email, id: data.data.id, status: data.data.status }));

      setIsSubmitting(false);
      setSuccessMsg(`Login Berhasil! Selamat datang kembali, ${data.data.username}.`);

      setTimeout(() => {
        onConfirmUpgrade();
        setSuccessMsg('');
        setLoginEmail('');
        setLoginPassword('');
      }, 1200);

    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg('Tidak dapat terhubung ke server. Pastikan backend berjalan.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs transition-all duration-300 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-150 flex flex-col overflow-hidden max-h-[92vh]">
        
        {/* Banner/Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-5 pr-12 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer p-1 rounded-full hover:bg-white/10"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center gap-1.5 bg-yellow-400/15 text-yellow-300 border border-yellow-400/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase mb-2">
            <Sparkles className="w-3 text-yellow-400 animate-pulse" />
            <span>MEMBER PREMIUM VIP</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1">
            <div>
              <h3 className="text-lg font-black tracking-tight flex items-center gap-1.5">
                Upgrade ke Nataktrip Premium
              </h3>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-normal">
                Dapatkan rekomendasi wisata terlengkap, rute instan, dan asisten AI pintar.
              </p>
            </div>
            <div className="shrink-0 bg-yellow-400 text-neutral-950 px-3 py-1.5 rounded-xl text-center shadow-md border border-yellow-300">
              <span className="text-[8px] font-black block uppercase tracking-wider leading-none">Hanya</span>
              <span className="text-sm font-black tracking-tight block leading-none mt-1">Rp 29.000</span>
              <span className="text-[8.5px] font-bold block leading-none mt-0.5">/ 3 Bulan</span>
            </div>
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          
          {/* Benefits */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
            <span className="text-[9.5px] font-bold font-mono text-slate-400 uppercase tracking-wider block mb-2">
              Keuntungan Akses VIP Premium:
            </span>
            <ul className="space-y-1.5">
              {benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[11px] text-slate-700">
                  <span className="w-3.5 h-3.5 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shrink-0 mt-0.5 border border-indigo-100">
                    <Check className="w-2.5 h-2.5 font-bold" />
                  </span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`py-2 text-[11.5px] font-black tracking-tight rounded-lg transition-all cursor-pointer ${
                activeTab === 'register' ? 'bg-white text-indigo-950 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              📝 Daftar Baru & Aktifkan
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`py-2 text-[11.5px] font-black tracking-tight rounded-lg transition-all cursor-pointer ${
                activeTab === 'login' ? 'bg-white text-indigo-950 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              🔑 Masuk dengan Akun
            </button>
          </div>

          {/* Messages */}
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-100 rounded-lg p-2.5 flex items-start gap-2 text-[11px] text-rose-700 animate-pulse">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2.5 flex items-start gap-2 text-[11px] text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* REGISTER */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterAndPay} className="space-y-3">
              <span className="text-[10px] font-extrabold font-mono text-slate-400 uppercase tracking-widest block border-b border-dashed border-slate-200 pb-1">
                Langkah 1: Informasi Registrasi Akun
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[9.5px] uppercase font-bold text-slate-400 tracking-wider mb-1">Nama Lengkap</label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                    <input type="text" placeholder="Contoh: Adelia Sari" required value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 font-medium" />
                  </div>
                </div>
                <div>
                  <label className="block text-[9.5px] uppercase font-bold text-slate-400 tracking-wider mb-1">Email Aktif</label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                    <input type="email" placeholder="adelia@travel.com" required value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 font-medium" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[9.5px] uppercase font-bold text-slate-400 tracking-wider mb-1">Sandi Baru (Min. 6 Karakter)</label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 font-mono tracking-widest" />
                </div>
              </div>

              <span className="text-[10px] font-extrabold font-mono text-slate-400 uppercase tracking-widest block border-b border-dashed border-slate-200 pb-1 pt-1.5">
                Langkah 2: Informasi Kartu Debit / Kredit (Simulasi)
              </span>

              <div className="space-y-2.5">
                <div>
                  <label className="block text-[9.5px] uppercase font-bold text-slate-400 tracking-wider mb-1">Nomor Kartu Debit/Kredit</label>
                  <div className="relative">
                    <CreditCard className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                    <input type="text" maxLength={19} placeholder="4111 2222 3333 4444" required value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                      className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 font-mono font-medium" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9.5px] uppercase font-bold text-slate-400 tracking-wider mb-1">Masa Berlaku</label>
                    <input type="text" maxLength={5} placeholder="MM/YY" required value={expiry}
                      onChange={(e) => setExpiry(e.target.value.replace(/[^\d/]/g, ''))}
                      className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 font-mono font-medium" />
                  </div>
                  <div>
                    <label className="block text-[9.5px] uppercase font-bold text-slate-400 tracking-wider mb-1">CVV / CVC</label>
                    <input type="password" maxLength={3} placeholder="•••" required value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 font-mono font-medium" />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row gap-2">
                <button type="button" onClick={onClose}
                  className="w-full sm:w-1/3 bg-slate-50 hover:bg-slate-150 border border-slate-200 text-slate-700 text-xs font-bold py-2 rounded-xl cursor-pointer text-center">
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="w-full sm:w-2/3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-600 text-white text-xs font-black py-2 rounded-xl cursor-pointer text-center flex justify-center items-center shadow-md transition-all uppercase tracking-wide">
                  {isSubmitting ? 'Mendaftarkan Akun...' : 'Daftar & Bayar Sekarang'}
                </button>
              </div>

              <div className="text-center">
                <button type="button" onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
                  className="text-[10.5px] font-bold text-indigo-600 hover:underline cursor-pointer">
                  Sudah punya akun? Masuk/Login di sini &rarr;
                </button>
              </div>
            </form>
          )}

          {/* LOGIN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 pt-1">
              <span className="text-[10px] font-extrabold font-mono text-slate-400 uppercase tracking-widest block border-b border-dashed border-slate-200 pb-1">
                Gunakan Akun Terdaftar untuk Mengaktifkan Akses
              </span>

              <div>
                <label className="block text-[9.5px] uppercase font-bold text-slate-400 tracking-wider mb-1">Email Akun</label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input type="email" placeholder="Masukkan email terdaftar" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 font-medium" />
                </div>
              </div>

              <div>
                <label className="block text-[9.5px] uppercase font-bold text-slate-400 tracking-wider mb-1">Kata Sandi</label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input type="password" placeholder="••••••••" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 font-mono tracking-widest" />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button type="button" onClick={onClose}
                  className="w-full sm:w-1/3 bg-slate-100 hover:bg-slate-150 border border-slate-200 text-slate-700 text-xs font-bold py-2 rounded-xl cursor-pointer text-center">
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="w-full sm:w-2/3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-black py-2 rounded-xl cursor-pointer text-center flex justify-center items-center shadow-md transition-all uppercase tracking-wide">
                  {isSubmitting ? 'Memverifikasi...' : 'Masuk & Aktifkan Premium'}
                </button>
              </div>

              <div className="text-center border-t border-slate-100 pt-3">
                <button type="button" onClick={() => { setActiveTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
                  className="text-[10.5px] font-bold text-indigo-600 hover:underline cursor-pointer">
                  &larr; Belum punya akun? Registrasi & Langganan Baru di sini
                </button>
              </div>
            </form>
          )}

          {/* Promo Code */}
          <div className="border-t border-slate-150 pt-3.5">
            <div className="bg-indigo-50/40 border border-indigo-100/70 rounded-xl p-2.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-900 mb-1">
                <Gift className="w-3.5 h-3.5 text-indigo-500" />
                <span>Uji Coba Instan dengan Kode Kupon?</span>
              </div>
              <p className="text-[10px] text-indigo-600 mb-2 leading-relaxed">
                Ketik kupon <span className="font-extrabold underline decoration-wavy">BABELBEBAS</span> untuk bypass simulasi pembayaran secara gratis.
              </p>
              <div className="flex gap-2">
                <input type="text" placeholder="KUMPULKAN KODE" value={promoCode} onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 uppercase rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-indigo-500 font-mono" />
                <button type="button" onClick={handleApplyPromo} disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-extrabold px-3 py-1 rounded-lg transition-all cursor-pointer disabled:opacity-50">
                  Klaim
                </button>
              </div>
            </div>
          </div>

          <p className="text-[9px] text-slate-400 text-center leading-normal pt-1 select-none">
            🔒 Ini adalah gerbang pariwisata simulasi virtual. Tidak ada penagihan uang asli.
          </p>

        </div>
      </div>
    </div>
  );
}
