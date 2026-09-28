import React from 'react';

interface HospitalLogoProps {
  className?: string;
  size?: number | string;
}

export const HospitalLogo: React.FC<HospitalLogoProps> = ({ 
  className = "w-10 h-10",
  size
}) => {
  return (
    <svg
      viewBox="0 0 500 500"
      className={`shrink-0 select-none ${className}`}
      style={size ? { width: size, height: size } : undefined}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="ตราสัญลักษณ์โรงพยาบาลสังขละบุรี (Sangkhlaburi Hospital Logo)"
    >
      <defs>
        {/* Paths for arched text */}
        {/* Top arc for Thai text */}
        <path
          id="skl-thai-text-arc"
          d="M 68,250 A 182,182 0 1,1 432,250"
          fill="none"
        />
        {/* Bottom arc for English text */}
        <path
          id="skl-eng-text-arc"
          d="M 432,250 A 182,182 0 0,1 68,250"
          fill="none"
        />
        {/* Shadow filter for depth */}
        <filter id="logo-drop-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#004d26" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Outer Circle Container */}
      <g filter="url(#logo-drop-shadow)">
        {/* Outer White Background */}
        <circle cx="250" cy="250" r="242" fill="#FFFFFF" stroke="#046A38" strokeWidth="6" />
        <circle cx="250" cy="250" r="236" fill="none" stroke="#046A38" strokeWidth="2.5" />
        
        {/* Inner Solid Green Circle */}
        <circle cx="250" cy="250" r="172" fill="#046A38" stroke="#FFFFFF" strokeWidth="4" />
        <circle cx="250" cy="250" r="166" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.7" />
      </g>

      {/* Arched Text: โรงพยาบาลสังขละบุรี (Thai on Top) */}
      <text
        fill="#046A38"
        fontFamily="'Prompt', 'Sarabun', sans-serif"
        fontSize="34"
        fontWeight="700"
        letterSpacing="2.5"
      >
        <textPath
          href="#skl-thai-text-arc"
          startOffset="50%"
          textAnchor="middle"
        >
          โรงพยาบาลสังขละบุรี
        </textPath>
      </text>

      {/* Arched Text: SANGKHLABURI HOSPITAL (English on Bottom) */}
      <text
        fill="#046A38"
        fontFamily="'Prompt', sans-serif"
        fontSize="24"
        fontWeight="700"
        letterSpacing="2.8"
      >
        <textPath
          href="#skl-eng-text-arc"
          startOffset="50%"
          textAnchor="middle"
        >
          SANGKHLABURI HOSPITAL
        </textPath>
      </text>

      {/* Left Thai Floral Ornament (กนก/ประจำยาม) */}
      <g transform="translate(48, 250) scale(0.65)" fill="#046A38">
        <path d="M 0,0 C -5,-10 -15,-12 -20,-6 C -25,0 -20,12 0,22 C 20,12 25,0 20,-6 C 15,-12 5,-10 0,0 Z" />
        <circle cx="0" cy="5" r="4" fill="#FFFFFF" />
        <circle cx="-14" cy="-3" r="2.5" />
        <circle cx="14" cy="-3" r="2.5" />
        <circle cx="0" cy="-14" r="2.5" />
        <circle cx="0" cy="24" r="2.5" />
      </g>

      {/* Right Thai Floral Ornament (กนก/ประจำยาม) */}
      <g transform="translate(452, 250) scale(0.65)" fill="#046A38">
        <path d="M 0,0 C -5,-10 -15,-12 -20,-6 C -25,0 -20,12 0,22 C 20,12 25,0 20,-6 C 15,-12 5,-10 0,0 Z" />
        <circle cx="0" cy="5" r="4" fill="#FFFFFF" />
        <circle cx="-14" cy="-3" r="2.5" />
        <circle cx="14" cy="-3" r="2.5" />
        <circle cx="0" cy="-14" r="2.5" />
        <circle cx="0" cy="24" r="2.5" />
      </g>

      {/* Inner Central Medical Emblem (Caduceus & Holy Flame) */}
      <g id="central-emblem" transform="translate(250, 250)">
        
        {/* Central Staff / Pillar */}
        <path
          d="M -6,130 L 6,130 L 8,30 L 10,-80 L -10,-80 L -8,30 Z"
          fill="#FFFFFF"
        />
        {/* Staff Base Ring & Point */}
        <path d="M -12,130 L 12,130 L 15,136 L -15,136 Z" fill="#FFFFFF" />
        <path d="M -10,138 L 10,138 L 6,146 L -6,146 Z" fill="#FFFFFF" />
        <path d="M -4,148 L 4,148 L 0,160 Z" fill="#FFFFFF" />
        
        {/* Staff Capital / Top Rings */}
        <ellipse cx="0" cy="-80" rx="14" ry="4" fill="#FFFFFF" />
        <rect x="-13" y="-87" width="26" height="5" rx="2" fill="#FFFFFF" />
        <path d="M -16,-92 L 16,-92 L 12,-87 L -12,-87 Z" fill="#FFFFFF" />

        {/* Sacred Flame (เปลวเพลิงยอดคทา) */}
        <g id="sacred-flame">
          {/* Main outer flame */}
          <path
            d="M 0,-165 
               C 8,-150 18,-135 15,-118
               C 22,-124 25,-110 20,-100
               C 25,-103 27,-97 22,-92
               C 10,-90 -10,-90 -22,-92
               C -27,-97 -25,-103 -20,-100
               C -25,-110 -22,-124 -15,-118
               C -18,-135 -8,-150 0,-165 Z"
            fill="#FFFFFF"
          />
          {/* Inner flame cutouts for traditional Thai flame texture */}
          <path
            d="M 0,-152 
               C 5,-140 10,-128 8,-115
               C 12,-119 14,-110 10,-103
               C 5,-98 -5,-98 -10,-103
               C -14,-110 -12,-119 -8,-115
               C -10,-128 -5,-140 0,-152 Z"
            fill="#046A38"
          />
          <path
            d="M 0,-140 
               C 3,-132 5,-122 4,-112
               C -4,-112 -3,-132 0,-140 Z"
            fill="#FFFFFF"
          />
        </g>

        {/* Stylized Wings (ปีกทูตแพทย์) */}
        {/* Right Wing */}
        <g id="right-wing">
          <path
            d="M 12,-80 
               C 35,-88 65,-102 95,-102
               C 108,-102 118,-96 112,-88
               C 102,-75 80,-70 65,-68
               C 85,-66 98,-58 92,-50
               C 82,-38 65,-40 45,-42
               C 65,-36 72,-26 62,-20
               C 48,-12 32,-25 15,-40
               C 12,-55 12,-70 12,-80 Z"
            fill="#FFFFFF"
          />
          {/* Feather details */}
          <path d="M 30,-72 C 60,-78 85,-85 100,-92" stroke="#046A38" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 28,-58 C 55,-60 75,-58 84,-52" stroke="#046A38" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 24,-44 C 42,-44 55,-35 58,-28" stroke="#046A38" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </g>

        {/* Left Wing (Mirrored) */}
        <g id="left-wing" transform="scale(-1, 1)">
          <path
            d="M 12,-80 
               C 35,-88 65,-102 95,-102
               C 108,-102 118,-96 112,-88
               C 102,-75 80,-70 65,-68
               C 85,-66 98,-58 92,-50
               C 82,-38 65,-40 45,-42
               C 65,-36 72,-26 62,-20
               C 48,-12 32,-25 15,-40
               C 12,-55 12,-70 12,-80 Z"
            fill="#FFFFFF"
          />
          {/* Feather details */}
          <path d="M 30,-72 C 60,-78 85,-85 100,-92" stroke="#046A38" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 28,-58 C 55,-60 75,-58 84,-52" stroke="#046A38" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 24,-44 C 42,-44 55,-35 58,-28" stroke="#046A38" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </g>

        {/* Coiled Twin Serpents (งูพันคทา 2 ตัว) */}
        {/* Serpent 1 (Left head curving to right) */}
        <g id="serpents">
          {/* Upper loops */}
          <path
            d="M -45,-42 
               C -75,-30 -75,10 -35,22 
               C 0,32 30,30 45,55 
               C 60,80 30,105 0,112
               C -25,118 -15,135 0,132"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="11"
            strokeLinecap="round"
          />
          <path
            d="M 45,-42 
               C 75,-30 75,10 35,22 
               C 0,32 -30,30 -45,55 
               C -60,80 -30,105 0,112
               C 25,118 15,135 0,132"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="11"
            strokeLinecap="round"
          />

          {/* Scale patterns on the serpents */}
          <path
            d="M -45,-42 
               C -75,-30 -75,10 -35,22 
               C 0,32 30,30 45,55 
               C 60,80 30,105 0,112"
            fill="none"
            stroke="#046A38"
            strokeWidth="2.2"
            strokeDasharray="3,3"
          />
          <path
            d="M 45,-42 
               C 75,-30 75,10 35,22 
               C 0,32 -30,30 -45,55 
               C -60,80 -30,105 0,112"
            fill="none"
            stroke="#046A38"
            strokeWidth="2.2"
            strokeDasharray="3,3"
          />

          {/* Left Serpent Head (พญานาค/งู หงอนไทย) */}
          <g transform="translate(-40, -42) rotate(25)">
            <path
              d="M 0,0 C -6,-10 -15,-6 -14,2 C -13,8 -4,10 4,8 C 10,7 12,2 8,-2 C 4,-6 8,-12 4,-14 C 0,-12 2,-4 0,0 Z"
              fill="#FFFFFF"
            />
            <circle cx="-4" cy="0" r="1.5" fill="#046A38" />
          </g>

          {/* Right Serpent Head */}
          <g transform="translate(40, -42) rotate(-25) scale(-1, 1)">
            <path
              d="M 0,0 C -6,-10 -15,-6 -14,2 C -13,8 -4,10 4,8 C 10,7 12,2 8,-2 C 4,-6 8,-12 4,-14 C 0,-12 2,-4 0,0 Z"
              fill="#FFFFFF"
            />
            <circle cx="-4" cy="0" r="1.5" fill="#046A38" />
          </g>
        </g>

      </g>
    </svg>
  );
};
