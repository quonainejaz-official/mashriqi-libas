import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'radial-gradient(120% 120% at 20% 10%, #114c3a 0%, #0b3a2e 35%, #07251d 100%)',
          color: '#f0d7a6',
          fontFamily: 'Arial, sans-serif',
          padding: '80px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '100%',
            border: '1px solid rgba(217, 179, 108, 0.35)',
            borderRadius: '28px',
            padding: '70px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            backgroundColor: 'rgba(7, 37, 29, 0.55)',
          }}
        >
          <div style={{ fontSize: 64, fontWeight: 600, letterSpacing: 2 }}>
            Mashriqi Libas
          </div>
          <div style={{ fontSize: 28, color: 'rgba(255, 255, 255, 0.8)' }}>
            Premium Eastern Wear
          </div>
          <div style={{ fontSize: 22, color: 'rgba(255, 255, 255, 0.65)' }}>
            Unstitched • Stitched • Luxury Pret
          </div>
        </div>
      </div>
    ),
    size
  );
}
