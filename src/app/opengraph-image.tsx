import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';

export const alt = 'PNT Academy - Shape the Future of Robotics';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
    const logoData = readFileSync(join(process.cwd(), 'public', 'logo.png'));
    const logoBase64 = `data:image/png;base64,${logoData.toString('base64')}`;

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #020617, #0f172a, #1e1b4b)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div style={{ display: 'flex', marginBottom: '50px' }}>
                    <img src={logoBase64} height={180} />
                </div>
                <div style={{ color: 'white', fontSize: 60, fontWeight: 900, fontFamily: 'sans-serif', textAlign: 'center' }}>
                    Shape the Future of Robotics.
                </div>
                <div style={{ color: '#94a3b8', fontSize: 32, marginTop: '20px', fontWeight: 500, fontFamily: 'sans-serif', textAlign: 'center' }}>
                    Internships & Real-World Tech Projects for Innovators
                </div>
            </div>
        ),
        { ...size }
    );
}
