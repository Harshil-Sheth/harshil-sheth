// Simplified world map SVG paths
// Using a lightweight representation for minimal loading

export const WORLD_MAP_PATHS = {
  // Simplified continents (very basic outline for minimal file size)
  continents: `
    M 150,120 L 180,110 L 210,115 L 240,110 L 270,120 L 300,115 L 320,125 L 340,120 L 360,130 L 380,125 L 400,135 
    L 400,180 L 380,185 L 360,180 L 340,190 L 320,185 L 300,195 L 280,190 L 260,200 L 240,195 L 220,205 L 200,200 
    L 180,210 L 160,205 L 150,215 L 150,240 L 170,245 L 190,240 L 210,250 L 230,245 L 250,255 L 270,250 L 290,260 
    L 310,255 L 330,265 L 350,260 L 370,270 L 390,265 L 400,275 L 400,300 L 150,300 Z
    
    M 420,140 L 450,135 L 480,145 L 510,140 L 540,150 L 570,145 L 600,155 L 630,150 L 660,160 L 690,155 L 720,165 
    L 720,280 L 690,285 L 660,280 L 630,290 L 600,285 L 570,295 L 540,290 L 510,300 L 480,295 L 450,305 L 420,300 Z
    
    M 740,130 L 770,125 L 800,135 L 830,130 L 860,140 L 890,135 L 900,145 L 900,260 L 870,265 L 840,260 L 810,270 
    L 780,265 L 750,275 L 740,280 Z
    
    M 200,320 L 230,315 L 260,325 L 290,320 L 320,330 L 350,325 L 380,335 L 410,330 L 440,340 L 470,335 L 500,345 
    L 500,420 L 470,425 L 440,420 L 410,430 L 380,425 L 350,435 L 320,430 L 290,440 L 260,435 L 230,445 L 200,440 Z
    
    M 100,340 L 130,335 L 160,345 L 180,340 L 180,380 L 160,385 L 130,380 L 100,390 Z
  `,
  // Country borders (optional, can be added for more detail)
  borders: ''
};

// Helper function to convert lat/long to SVG coordinates
export function latLongToXY(latitude, longitude, width = 1000, height = 500) {
  // Mercator projection (simplified)
  const x = ((longitude + 180) / 360) * width;
  const latRad = latitude * Math.PI / 180;
  const mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
  const y = (height / 2) - (width * mercN / (2 * Math.PI));
  
  return { x, y };
}

// Get marker size based on visit count
export function getMarkerSize(count) {
  if (count === 1) return 4;
  if (count <= 5) return 6;
  if (count <= 10) return 8;
  if (count <= 50) return 12;
  return 16;
}

// Get marker color intensity
export function getMarkerOpacity(count) {
  return Math.min(0.4 + (count / 20), 1);
}
