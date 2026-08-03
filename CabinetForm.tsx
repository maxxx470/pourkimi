import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { CabinetInfo } from '../../../types/recap';

interface CabinetFormProps {
  cabinet: CabinetInfo;
  onChange: (cabinet: CabinetInfo) => void;
}

export const CabinetForm: React.FC<CabinetFormProps> = ({ cabinet, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleTextChange = (field: keyof CabinetInfo, value: string) => {
    onChange({
      ...cabinet,
      [field]: value,
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange({
            ...cabinet,
            logoUrl: event.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    onChange({
      ...cabinet,
      logoUrl: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        padding: '14px',
      }}
      className="font-sans shadow-2xs space-y-3"
    >
      <div
        style={{
          fontSize: '13px',
          fontWeight: 700,
          color: '#1E293B',
          marginBottom: '10px',
        }}
        className="font-sans"
      >
        Informations du cabinet
      </div>

      {/* Champ Nom du cabinet */}
      <div>
        <label
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#1E293B',
            marginBottom: '3px',
            display: 'block',
          }}
          className="font-sans"
        >
          Nom du cabinet
        </label>
        <input
          type="text"
          value={cabinet.nom}
          onChange={(e) => handleTextChange('nom', e.target.value)}
          placeholder="Ex: Cabinet Architecture Diallo"
          style={{
            width: '100%',
            height: '32px',
            border: '1px solid rgba(0,0,0,0.10)',
            borderRadius: '7px',
            padding: '0 10px',
            fontSize: '12px',
            color: '#1E293B',
            backgroundColor: '#ffffff',
          }}
          className="font-sans outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 transition-all"
        />
      </div>

      {/* Champ Email professionnel */}
      <div>
        <label
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#1E293B',
            marginBottom: '3px',
            display: 'block',
          }}
          className="font-sans"
        >
          Email professionnel
        </label>
        <input
          type="email"
          value={cabinet.email}
          onChange={(e) => handleTextChange('email', e.target.value)}
          placeholder="contact@cabinet.com"
          style={{
            width: '100%',
            height: '32px',
            border: '1px solid rgba(0,0,0,0.10)',
            borderRadius: '7px',
            padding: '0 10px',
            fontSize: '12px',
            color: '#1E293B',
            backgroundColor: '#ffffff',
          }}
          className="font-sans outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 transition-all"
        />
      </div>

      {/* Champ Téléphone */}
      <div>
        <label
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#1E293B',
            marginBottom: '3px',
            display: 'block',
          }}
          className="font-sans"
        >
          Téléphone
        </label>
        <input
          type="text"
          value={cabinet.telephone}
          onChange={(e) => handleTextChange('telephone', e.target.value)}
          placeholder="+225 07 00 00 00"
          style={{
            width: '100%',
            height: '32px',
            border: '1px solid rgba(0,0,0,0.10)',
            borderRadius: '7px',
            padding: '0 10px',
            fontSize: '12px',
            color: '#1E293B',
            backgroundColor: '#ffffff',
          }}
          className="font-sans outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 transition-all"
        />
      </div>

      {/* Champ Logo */}
      <div>
        <label
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#1E293B',
            marginBottom: '3px',
            display: 'block',
          }}
          className="font-sans"
        >
          Logo
        </label>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="hidden"
        />

        {!cabinet.logoUrl ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 cursor-pointer group p-1 rounded-lg hover:bg-white/60 transition-colors"
          >
            <div className="w-8 h-8 rounded-[8px] bg-[#EEF2FF] flex items-center justify-center shrink-0">
              <Upload size={14} className="text-[#4F46E5]" />
            </div>
            <span className="font-sans text-[11px] text-[#475569] group-hover:text-[#1E293B] transition-colors font-medium">
              Aucun logo — utiliser le nom seul
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-white border border-[#E2E8F0] p-1.5 rounded-[8px]">
            <div className="flex items-center gap-2.5">
              <img
                src={cabinet.logoUrl}
                alt="Logo cabinet"
                className="w-8 h-8 object-cover rounded-[8px] border border-[#E2E8F0]"
              />
              <span className="font-sans text-[11px] font-semibold text-[#1E293B]">
                Logo importé
              </span>
            </div>
            <button
              type="button"
              onClick={handleRemoveLogo}
              className="p-1 rounded-full text-[#475569] hover:text-[#E8442A] hover:bg-[#FEF0EC] transition-colors cursor-pointer"
              title="Retirer le logo"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
