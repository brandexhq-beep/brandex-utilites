import React, { useState, useEffect, useRef } from 'react';
import Link from '@/components/Link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UniversalSearchModal from '@/components/UniversalSearchModal';
import Toast from '@/components/Toast';
import { 
  generateCustomQRCode, 
  decodeQRCodeFromImage, 
  calculateContrastRatio,
  DecodedQRPayload 
} from '@/lib/engine/qrStudioEngine';
import { 
  QrCode, 
  Upload, 
  Palette, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Copy, 
  FileText, 
  ExternalLink, 
  Wifi, 
  CreditCard, 
  User, 
  MapPin, 
  Calendar, 
  Mail, 
  Phone, 
  MessageSquare,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Layers,
  Sliders,
  Printer,
  FileSpreadsheet
} from 'lucide-react';
import JSZip from 'jszip';

type MainTab = 'create' | 'decode' | 'batch';
type PayloadType = 'url' | 'text' | 'email' | 'phone' | 'sms' | 'whatsapp' | 'wifi' | 'vcard' | 'location' | 'calendar' | 'upi';

export default function QRStudioPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<MainTab>('create');

  // Payload Type State
  const [payloadType, setPayloadType] = useState<PayloadType>('url');

  // Form Field Inputs
  const [urlInput, setUrlInput] = useState('https://brandex.co.in');
  const [textInput, setTextInput] = useState('BrandEX Utilities: 100% Local-First Software Toolkit');
  const [emailInput, setEmailInput] = useState({ address: 'brandexhq@gmail.com', subject: 'Inquiry', body: 'Hello BrandEX team' });
  const [phoneInput, setPhoneInput] = useState('+919986880072');
  const [smsInput, setSmsInput] = useState({ phone: '+919986880072', message: 'Hi from BrandEX' });
  const [whatsappInput, setWhatsappInput] = useState({ phone: '+919986880072', message: 'Hello BrandEX' });
  const [wifiInput, setWifiInput] = useState({ ssid: 'BrandEX_Office', password: 'securepassword123', security: 'WPA' });
  const [vcardInput, setVcardInput] = useState({ name: 'BrandEX Engineering', company: 'Brandex', title: 'Developer', phone: '+919986880072', email: 'brandexhq@gmail.com', website: 'https://brandex.co.in' });
  const [locationInput, setLocationInput] = useState({ lat: '12.9716', lng: '77.5946', name: 'Bangalore Office' });
  const [calendarInput, setCalendarInput] = useState({ title: 'BrandEX Platform Release', location: 'Online', start: '2026-09-08T10:00', end: '2026-09-08T11:00', desc: 'Local-first platform milestone' });
  const [upiInput, setUpiInput] = useState({ pa: 'brandex@upi', pn: 'Brandex Tech', am: '100', tn: 'Software Utility License' });

  // Customization State
  const [fgColor, setFgColor] = useState('#0F172A');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [qrSize, setQrSize] = useState(380);
  const [margin, setMargin] = useState(2);
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [frameText, setFrameText] = useState('SCAN ME');
  const [hasFrame, setHasFrame] = useState(false);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [logoSizePercent, setLogoSizePercent] = useState(18);

  // Output State
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [qrSvgString, setQrSvgString] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [contrastStatus, setContrastStatus] = useState({ ratio: 15, isGood: true });

  // Toast
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Decode State
  const [decodeLoading, setDecodeLoading] = useState(false);
  const [decodedResult, setDecodedResult] = useState<DecodedQRPayload | null>(null);
  const [decodeError, setDecodeError] = useState<string | null>(null);

  // Batch State
  const [batchCsvText, setBatchCsvText] = useState("Name,URL\nBrandEX Official,https://brandex.co.in\nUtilities Hub,https://brandex.co.in/categories\nDeveloper Suite,https://brandex.co.in/categories/dev");
  const [batchCount, setBatchCount] = useState(3);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);

  // Compile Current Payload String
  const computePayloadString = (): string => {
    switch (payloadType) {
      case 'url':
        return urlInput.trim() || 'https://brandex.co.in';
      case 'text':
        return textInput.trim() || 'BrandEX';
      case 'email':
        return `mailto:${emailInput.address}?subject=${encodeURIComponent(emailInput.subject)}&body=${encodeURIComponent(emailInput.body)}`;
      case 'phone':
        return `tel:${phoneInput.trim()}`;
      case 'sms':
        return `smsto:${smsInput.phone}:${smsInput.message}`;
      case 'whatsapp':
        return `https://wa.me/${whatsappInput.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappInput.message)}`;
      case 'wifi':
        return `WIFI:T:${wifiInput.security};S:${wifiInput.ssid};P:${wifiInput.password};;`;
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardInput.name}\nORG:${vcardInput.company}\nTITLE:${vcardInput.title}\nTEL:${vcardInput.phone}\nEMAIL:${vcardInput.email}\nURL:${vcardInput.website}\nEND:VCARD`;
      case 'location':
        return `geo:${locationInput.lat},${locationInput.lng}?q=${encodeURIComponent(locationInput.name)}`;
      case 'calendar':
        return `BEGIN:VEVENT\nSUMMARY:${calendarInput.title}\nLOCATION:${calendarInput.location}\nDESCRIPTION:${calendarInput.desc}\nDTSTART:${calendarInput.start.replace(/[-:]/g, '')}\nDTEND:${calendarInput.end.replace(/[-:]/g, '')}\nEND:VEVENT`;
      case 'upi':
        return `upi://pay?pa=${encodeURIComponent(upiInput.pa)}&pn=${encodeURIComponent(upiInput.pn)}&am=${encodeURIComponent(upiInput.am)}&tn=${encodeURIComponent(upiInput.tn)}`;
      default:
        return 'https://brandex.co.in';
    }
  };

  // Generate QR Code Live
  useEffect(() => {
    let isMounted = true;
    const updateQR = async () => {
      try {
        setIsGenerating(true);
        const payload = computePayloadString();
        const contrast = calculateContrastRatio(fgColor, bgColor);
        setContrastStatus(contrast);

        const { svgString, dataUrl } = await generateCustomQRCode(payload, {
          fgColor,
          bgColor,
          width: qrSize,
          margin,
          errorCorrectionLevel: errorCorrection,
          logoDataUrl: logoDataUrl || undefined,
          logoSizePercent
        });

        if (isMounted) {
          setQrSvgString(svgString);
          setQrDataUrl(dataUrl);
          setIsGenerating(false);
        }
      } catch (err: any) {
        if (isMounted) setIsGenerating(false);
      }
    };

    updateQR();
    return () => { isMounted = false; };
  }, [
    payloadType,
    urlInput,
    textInput,
    emailInput,
    phoneInput,
    smsInput,
    whatsappInput,
    wifiInput,
    vcardInput,
    locationInput,
    calendarInput,
    upiInput,
    fgColor,
    bgColor,
    qrSize,
    margin,
    errorCorrection,
    logoDataUrl,
    logoSizePercent
  ]);

  // Brand Presets Handler
  const applyPreset = (preset: 'brandex' | 'corporate' | 'minimal' | 'monochrome') => {
    if (preset === 'brandex') {
      setFgColor('#4F46E5');
      setBgColor('#FFFFFF');
    } else if (preset === 'corporate') {
      setFgColor('#0F172A');
      setBgColor('#F8FAFC');
    } else if (preset === 'minimal') {
      setFgColor('#1E293B');
      setBgColor('#FFFFFF');
    } else if (preset === 'monochrome') {
      setFgColor('#000000');
      setBgColor('#FFFFFF');
    }
  };

  // Export Downloads
  const downloadPNG = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `brandex_qr_${payloadType}.png`;
    link.click();
    setToastMessage('PNG QR Code downloaded successfully.');
    setShowToast(true);
  };

  const downloadSVG = () => {
    if (!qrSvgString) return;
    const blob = new Blob([qrSvgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `brandex_qr_${payloadType}.svg`;
    link.click();
    setToastMessage('Vector SVG QR Code exported successfully.');
    setShowToast(true);
  };

  const copyPayload = () => {
    const payload = computePayloadString();
    navigator.clipboard.writeText(payload);
    setToastMessage('Payload string copied to clipboard!');
    setShowToast(true);
  };

  // Decode QR File Handler
  const handleDecodeFile = async (file: File) => {
    setDecodeLoading(true);
    setDecodeError(null);
    setDecodedResult(null);

    try {
      const res = await decodeQRCodeFromImage(file);
      setDecodedResult(res);
      setToastMessage(`Detected ${res.type} payload successfully!`);
      setShowToast(true);
    } catch (err: any) {
      setDecodeError(err.message || 'Failed to detect QR code.');
    } finally {
      setDecodeLoading(false);
    }
  };

  // Batch Generation ZIP
  const handleBatchGenerate = async () => {
    setIsBatchGenerating(true);
    try {
      const zip = new JSZip();
      const lines = batchCsvText.trim().split('\n');
      let created = 0;

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');
        if (parts.length >= 2) {
          const name = parts[0].trim().replace(/[^a-zA-Z0-9_-]/g, '_');
          const val = parts[1].trim();
          if (val) {
            const { svgString } = await generateCustomQRCode(val, {
              fgColor,
              bgColor,
              width: 400
            });
            zip.file(`${name || `qr_${i}`}.svg`, svgString);
            created++;
          }
        }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `brandex_batch_qrcodes_${created}.zip`;
      link.click();

      setToastMessage(`Batch complete! Exported ${created} QR codes in a ZIP package.`);
      setShowToast(true);
    } catch (err: any) {
      alert(`Batch error: ${err.message}`);
    } finally {
      setIsBatchGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col selection:bg-[#EEF2FF] selection:text-[#4F46E5]">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} currentPath="/tools/qr-studio" />
      <UniversalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <Toast message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} />

      <main className="flex-1 w-full px-6 sm:px-10 py-6 max-w-7xl mx-auto">
        
        {/* BREADCRUMB */}
        <div className="flex items-center space-x-2 text-xs font-medium text-slate-400 mb-6">
          <Link href="/" className="hover:text-[#4F46E5] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/categories/qr" className="hover:text-[#4F46E5] transition-colors">QR & Codes</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">QR Studio</span>
        </div>

        {/* HEADER HERO */}
        <div className="bg-gradient-to-br from-white via-[#FAFAFF] to-[#EEF2FF]/70 border border-slate-200 rounded-3xl p-8 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#EEF2FF] border border-indigo-100 text-[#4F46E5] text-xs font-extrabold tracking-wide uppercase mb-3">
                <QrCode className="w-3.5 h-3.5 mr-1" />
                <span>CLIENT-SIDE QR WORKSPACE</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                BrandEX QR Studio
              </h1>
              <p className="text-slate-600 text-sm max-w-2xl font-medium">
                Create, decode, customize, validate, test, and export high-resolution QR codes entirely inside your browser session. Zero cloud file uploads.
              </p>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0">
              <button
                onClick={() => setActiveTab('create')}
                className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  activeTab === 'create'
                    ? 'bg-white text-[#4F46E5] shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create QR
              </button>
              <button
                onClick={() => setActiveTab('decode')}
                className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  activeTab === 'decode'
                    ? 'bg-white text-[#4F46E5] shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Decode QR
              </button>
              <button
                onClick={() => setActiveTab('batch')}
                className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  activeTab === 'batch'
                    ? 'bg-white text-[#4F46E5] shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Batch Studio
              </button>
            </div>
          </div>
        </div>

        {/* 1. CREATE QR TAB */}
        {activeTab === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            
            {/* LEFT COLUMN: PAYLOAD TYPE & DATA INPUTS */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* PAYLOAD TYPE SELECTOR PILLS */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block mb-3">
                  1. Choose Payload Type
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {[
                    { id: 'url', label: 'URL', icon: ExternalLink },
                    { id: 'text', label: 'Text', icon: FileText },
                    { id: 'upi', label: 'India UPI', icon: CreditCard },
                    { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
                    { id: 'vcard', label: 'vCard', icon: User },
                    { id: 'email', label: 'Email', icon: Mail },
                    { id: 'phone', label: 'Phone', icon: Phone },
                    { id: 'sms', label: 'SMS', icon: MessageSquare },
                    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
                    { id: 'location', label: 'Location', icon: MapPin },
                    { id: 'calendar', label: 'Event', icon: Calendar }
                  ].map(t => {
                    const Icon = t.icon;
                    const isSelected = payloadType === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setPayloadType(t.id as PayloadType)}
                        className={`p-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 border ${
                          isSelected
                            ? 'bg-[#EEF2FF] text-[#4F46E5] border-[#4F46E5] ring-2 ring-[#4F46E5]/20 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="truncate">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* DYNAMIC PAYLOAD DATA FORM */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                  2. Enter {payloadType.toUpperCase()} Details
                </label>

                {payloadType === 'url' && (
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">Destination URL:</label>
                    <input 
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://brandex.co.in"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10"
                    />
                  </div>
                )}

                {payloadType === 'text' && (
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">Plain Text / Notes:</label>
                    <textarea 
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      rows={3}
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 resize-none"
                    />
                  </div>
                )}

                {payloadType === 'upi' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">UPI ID / VPA (Required):</label>
                      <input 
                        type="text"
                        value={upiInput.pa}
                        onChange={(e) => setUpiInput({ ...upiInput, pa: e.target.value })}
                        placeholder="merchant@okhdfcbank"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#4F46E5]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">Payee / Merchant Name:</label>
                      <input 
                        type="text"
                        value={upiInput.pn}
                        onChange={(e) => setUpiInput({ ...upiInput, pn: e.target.value })}
                        placeholder="Brandex Official"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#4F46E5]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">Amount (Optional INR):</label>
                      <input 
                        type="number"
                        value={upiInput.am}
                        onChange={(e) => setUpiInput({ ...upiInput, am: e.target.value })}
                        placeholder="100.00"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#4F46E5]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">Transaction Note:</label>
                      <input 
                        type="text"
                        value={upiInput.tn}
                        onChange={(e) => setUpiInput({ ...upiInput, tn: e.target.value })}
                        placeholder="Payment for services"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#4F46E5]"
                      />
                    </div>
                  </div>
                )}

                {payloadType === 'wifi' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">Network SSID:</label>
                      <input 
                        type="text"
                        value={wifiInput.ssid}
                        onChange={(e) => setWifiInput({ ...wifiInput, ssid: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#4F46E5]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">Network Password:</label>
                      <input 
                        type="text"
                        value={wifiInput.password}
                        onChange={(e) => setWifiInput({ ...wifiInput, password: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#4F46E5]"
                      />
                    </div>
                  </div>
                )}

                {payloadType === 'vcard' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">Full Name:</label>
                      <input 
                        type="text"
                        value={vcardInput.name}
                        onChange={(e) => setVcardInput({ ...vcardInput, name: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#4F46E5]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">Company / Organization:</label>
                      <input 
                        type="text"
                        value={vcardInput.company}
                        onChange={(e) => setVcardInput({ ...vcardInput, company: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#4F46E5]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">Phone Number:</label>
                      <input 
                        type="tel"
                        value={vcardInput.phone}
                        onChange={(e) => setVcardInput({ ...vcardInput, phone: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#4F46E5]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">Email Address:</label>
                      <input 
                        type="email"
                        value={vcardInput.email}
                        onChange={(e) => setVcardInput({ ...vcardInput, email: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#4F46E5]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* CUSTOMIZATION CONTROLS */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    3. Visual Styling & Presets
                  </label>
                  <div className="flex space-x-1.5">
                    {[
                      { id: 'brandex', label: 'BrandEX' },
                      { id: 'corporate', label: 'Corporate' },
                      { id: 'minimal', label: 'Minimal' },
                      { id: 'monochrome', label: 'B&W' }
                    ].map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => applyPreset(p.id as any)}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-slate-100 hover:bg-[#EEF2FF] hover:text-[#4F46E5] text-slate-700 transition-colors"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Foreground Color:</label>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="color" 
                        value={fgColor} 
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                      />
                      <input 
                        type="text" 
                        value={fgColor} 
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-20 px-2 py-1 text-xs font-mono rounded border border-slate-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Background Color:</label>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="color" 
                        value={bgColor} 
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                      />
                      <input 
                        type="text" 
                        value={bgColor} 
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-20 px-2 py-1 text-xs font-mono rounded border border-slate-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Error Correction:</label>
                    <select
                      value={errorCorrection}
                      onChange={(e) => setErrorCorrection(e.target.value as any)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 bg-white"
                    >
                      <option value="L">L (7% Recovery)</option>
                      <option value="M">M (15% Recovery)</option>
                      <option value="Q">Q (25% Recovery)</option>
                      <option value="H">H (30% Highest)</option>
                    </select>
                  </div>
                </div>

                {/* LOGO UPLOAD & EMBED SECTION */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-extrabold text-slate-800">Embed Center Logo:</label>
                    {logoDataUrl && (
                      <button
                        type="button"
                        onClick={() => setLogoDataUrl(null)}
                        className="text-[11px] font-bold text-rose-600 hover:underline"
                      >
                        Remove Logo
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer border border-slate-200 transition-colors">
                      <input 
                        type="file" 
                        accept="image/png,image/jpeg,image/svg+xml,image/webp" 
                        className="hidden" 
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            const r = new FileReader();
                            r.onload = () => setLogoDataUrl(r.result as string);
                            r.readAsDataURL(f);
                          }
                        }}
                      />
                      <span>{logoDataUrl ? 'Change Logo Image' : '+ Upload Logo (PNG/JPG/SVG)'}</span>
                    </label>

                    {logoDataUrl && (
                      <div className="flex items-center space-x-3 flex-1">
                        <span className="text-[11px] text-slate-500 font-medium">Logo Size:</span>
                        <input 
                          type="range" 
                          min="10" 
                          max="28" 
                          value={logoSizePercent} 
                          onChange={(e) => setLogoSizePercent(Number(e.target.value))}
                          className="w-28 accent-[#4F46E5] cursor-pointer"
                        />
                        <span className="text-xs font-mono font-bold text-[#4F46E5]">{logoSizePercent}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: LIVE QR PREVIEW & VALIDATION DASHBOARD */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* LIVE QR PREVIEW BOX */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
                <div className="w-full flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                  <span className="text-xs font-extrabold text-[#4F46E5] uppercase tracking-wider">Live Vector Preview</span>
                  <span className="text-[10px] font-mono text-slate-400">{qrSize} × {qrSize} px</span>
                </div>

                {/* QR RENDER CONTAINER */}
                <div 
                  className="p-6 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center transition-all min-h-[300px] w-full max-w-[340px]"
                  style={{ backgroundColor: bgColor }}
                >
                  {qrDataUrl ? (
                    <img 
                      src={qrDataUrl} 
                      alt="Generated QR" 
                      className="w-full h-auto object-contain rounded-lg transition-all"
                    />
                  ) : (
                    <div className="text-slate-400 text-xs animate-pulse">Rendering matrix...</div>
                  )}
                </div>

                {/* ACTION BUTTONS */}
                <div className="grid grid-cols-2 gap-3 w-full mt-6">
                  <button
                    onClick={downloadPNG}
                    className="px-4 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-extrabold flex items-center justify-center space-x-1.5 shadow-sm transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PNG</span>
                  </button>

                  <button
                    onClick={downloadSVG}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold flex items-center justify-center space-x-1.5 shadow-sm transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export SVG</span>
                  </button>
                </div>

                <div className="flex items-center justify-center space-x-3 w-full mt-3">
                  <button
                    onClick={copyPayload}
                    className="text-xs text-slate-600 hover:text-[#4F46E5] font-bold flex items-center space-x-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Raw Payload</span>
                  </button>
                </div>
              </div>

              {/* REAL READABILITY & VALIDATION DASHBOARD */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  <span>QR Quality & Readability Check</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${contrastStatus.isGood ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {contrastStatus.isGood ? '✓ READABLE' : '⚠ LOW CONTRAST'}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600 font-medium">
                  <div className="flex justify-between items-center py-1 border-b border-slate-200">
                    <span>Payload Validation</span>
                    <span className="text-emerald-600 font-bold flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Valid Structure</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-slate-200">
                    <span>Color Contrast Ratio</span>
                    <span className={`font-mono font-bold ${contrastStatus.isGood ? 'text-slate-900' : 'text-rose-600'}`}>
                      {contrastStatus.ratio}:1 {contrastStatus.isGood ? '(Pass)' : '(Fail < 3.0)'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-slate-200">
                    <span>Quiet Zone Margin</span>
                    <span className="text-emerald-600 font-bold flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Safe ({margin} modules)</span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span>Error Correction Rating</span>
                    <span className="text-[#4F46E5] font-bold font-mono">Level {errorCorrection}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 2. DECODE QR TAB */}
        {activeTab === 'decode' && (
          <div className="max-w-3xl mx-auto space-y-6 mb-16">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h2 className="text-lg font-extrabold text-slate-900 mb-2">Upload or Drop QR Code Image</h2>
              <p className="text-xs text-slate-500 mb-6 font-medium">
                Detect, inspect, and extract payloads from any PNG, JPG, or WebP screenshot containing a QR code.
              </p>

              {/* DROPZONE */}
              <div className="border-2 border-dashed border-slate-200 hover:border-[#4F46E5] rounded-2xl p-8 text-center transition-colors cursor-pointer relative bg-slate-50/50">
                <input 
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleDecodeFile(e.target.files[0]);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-800">
                    {decodeLoading ? 'Analyzing QR Matrix...' : 'Click to Choose QR Image or Drag & Drop'}
                  </p>
                  <p className="text-xs text-slate-400">Supports PNG, JPG, WEBP, and Screenshots</p>
                </div>
              </div>

              {/* ERROR STATE */}
              {decodeError && (
                <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-extrabold">Decode Failed:</strong> {decodeError}
                  </div>
                </div>
              )}

              {/* SUCCESSFUL DECODE RESULT */}
              {decodedResult && (
                <div className="mt-6 p-6 rounded-2xl bg-[#EEF2FF]/40 border border-indigo-100 space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-xs font-extrabold text-[#4F46E5] uppercase tracking-wider">Detected: {decodedResult.type} Payload</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">100% Local Decode</span>
                  </div>

                  {/* RAW PAYLOAD DISPLAY */}
                  <div>
                    <label className="text-[11px] font-extrabold text-slate-700 block mb-1">Decoded Payload Content:</label>
                    <pre className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-900 break-all whitespace-pre-wrap">
                      {decodedResult.raw}
                    </pre>
                  </div>

                  {/* DETAILED PROPERTY BREAKDOWN */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {Object.entries(decodedResult.details).map(([k, v]) => (
                      <div key={k} className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                        <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">{k}</span>
                        <span className="font-extrabold text-slate-900 break-all">{v}</span>
                      </div>
                    ))}
                  </div>

                  {/* URL BREAKDOWN AND CLEAN ACTION */}
                  {decodedResult.isUrl && decodedResult.urlParts && (
                    <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-slate-900">Clean URL (Tracking Parameters Stripped):</span>
                        <button
                          onClick={() => {
                            if (decodedResult.cleanUrl) {
                              navigator.clipboard.writeText(decodedResult.cleanUrl);
                              setToastMessage('Clean URL copied!');
                              setShowToast(true);
                            }
                          }}
                          className="text-[11px] font-bold text-[#4F46E5] hover:underline"
                        >
                          Copy Clean URL
                        </button>
                      </div>
                      <p className="font-mono text-[11px] text-emerald-700 break-all">{decodedResult.cleanUrl}</p>
                    </div>
                  )}

                  {/* ACTION BAR */}
                  <div className="pt-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(decodedResult.raw);
                        setToastMessage('Payload copied to clipboard!');
                        setShowToast(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 hover:border-[#4F46E5] flex items-center space-x-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Payload</span>
                    </button>

                    {decodedResult.isUrl && (
                      <a
                        href={decodedResult.cleanUrl || decodedResult.raw}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-[#4F46E5] text-white text-xs font-bold hover:bg-[#4338CA] flex items-center space-x-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open Link Safely</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. BATCH QR STUDIO TAB */}
        {activeTab === 'batch' && (
          <div className="max-w-3xl mx-auto space-y-6 mb-16">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-5">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 mb-1">Batch CSV → QR Generator</h2>
                <p className="text-xs text-slate-500 font-medium">
                  Paste or import CSV rows to generate and download a ZIP package of high-res vector QR codes locally.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">CSV Payload Data (Header: Name,URL):</label>
                <textarea 
                  value={batchCsvText}
                  onChange={(e) => {
                    setBatchCsvText(e.target.value);
                    setBatchCount(Math.max(0, e.target.value.trim().split('\n').length - 1));
                  }}
                  rows={6}
                  className="w-full p-3.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-900 focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-slate-600">
                  Detected <strong className="text-slate-900 font-extrabold">{batchCount}</strong> items for batch processing.
                </span>

                <button
                  onClick={handleBatchGenerate}
                  disabled={isBatchGenerating || batchCount === 0}
                  className="px-6 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-extrabold flex items-center space-x-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>{isBatchGenerating ? 'Generating ZIP...' : 'Generate & Download ZIP'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
