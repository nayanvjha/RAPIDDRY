import React, { useState } from 'react';
import { Button } from './components/rapidry/Button';
import { Input } from './components/rapidry/Input';
import { Tag } from './components/rapidry/Tag';
import { Card, GlassCard } from './components/rapidry/Card';
import { 
  DisplayXL, 
  DisplayL, 
  Heading1, 
  Heading2, 
  LabelL, 
  LabelM, 
  LabelS, 
  BodyL, 
  BodyM, 
  Caption 
} from './components/rapidry/Typography';
import { StatusBadge } from './components/rapidry/StatusBadge';
import { Toast } from './components/rapidry/Toast';
import { SplashScreen } from './components/rapidry/SplashScreen';
import { PhoneLoginScreen } from './components/rapidry/PhoneLoginScreen';
import { OTPVerificationScreen } from './components/rapidry/OTPVerificationScreen';
import { HomeScreen } from './components/rapidry/HomeScreen';
import { ServiceDetailScreen } from './components/rapidry/ServiceDetailScreen';
import { PickupSchedulingScreen } from './components/rapidry/PickupSchedulingScreen';
import { CartReviewScreen } from './components/rapidry/CartReviewScreen';
import { PaymentConfirmationScreen } from './components/rapidry/PaymentConfirmationScreen';
import { OrderTrackingScreen } from './components/rapidry/OrderTrackingScreen';
import { OrderConfirmedScreen } from './components/rapidry/OrderConfirmedScreen';
import { AccountScreen } from './components/rapidry/AccountScreen';
import { AgentDashboard } from './components/rapidry/AgentDashboard';
import { AgentTaskDetailScreen } from './components/rapidry/AgentTaskDetailScreen';
import { AgentProfileScreen } from './components/rapidry/AgentProfileScreen';
import { AgentVerificationScreen } from './components/rapidry/AgentVerificationScreen';
import { AgentVerifyItemsScreen } from './components/rapidry/AgentVerifyItemsScreen';
import { AgentEarningsScreen } from './components/rapidry/AgentEarningsScreen';
import { AdminDashboard } from './components/rapidry/AdminDashboard';
import { AdminOrdersPage } from './components/rapidry/AdminOrdersPage';
import { AdminManagementPage } from './components/rapidry/AdminManagementPage';
import { PartnerKanbanBoard } from './components/rapidry/PartnerKanbanBoard';
import { PartnerOrderDetail } from './components/rapidry/PartnerOrderDetail';

// For React Native export: Save these as logo-light.png, logo-dark.png, logo-icon.png
import logoLight from 'figma:asset/35f760095b7ec0e7f2f8193910c32d87fbed5934.png';
import logoDark from 'figma:asset/9ddc68491eabfd68e11094833e9264a1b5435503.png';
import logoIcon from 'figma:asset/f90ceb00702b22ff209113e464599d98455b80c7.png';

export default function App() {
  const [activeTab, setActiveTab] = useState<'splash' | 'login' | 'otp' | 'home' | 'service' | 'pickup' | 'cart' | 'payment' | 'confirmed' | 'tracking' | 'account' | 'agent' | 'agenttask' | 'agentprofile' | 'agentverify' | 'agentearnings' | 'admin' | 'adminorders' | 'adminmanagement' | 'partner' | 'partnerdetail' | 'overview' | 'colors' | 'typography' | 'components'>('adminorders');

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--color-forest-dark)] px-[var(--space-base)] py-[var(--space-lg)]">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <img src={logoDark} alt="Rapidry" className="h-8" />
          <LabelM className="text-[var(--color-gold)]">Design System</LabelM>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="sticky top-[72px] z-40 bg-[var(--color-white)] border-b border-[var(--color-cream-dark)]">
        <div className="max-w-md mx-auto px-[var(--space-base)]">
          <div className="flex gap-2 overflow-x-auto py-2">
            {(['splash', 'login', 'otp', 'home', 'service', 'pickup', 'cart', 'payment', 'confirmed', 'tracking', 'account', 'agent', 'agenttask', 'agentprofile', 'agentverify', 'agentearnings', 'admin', 'adminorders', 'adminmanagement', 'partner', 'partnerdetail', 'overview', 'colors', 'typography', 'components'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-[var(--radius-md)] transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-[var(--color-gold)] text-[var(--color-forest-dark)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-cream)]'
                }`}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  fontWeight: 500
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className={`mx-auto pb-[var(--space-section)] ${
        activeTab === 'admin' || activeTab === 'adminorders' || activeTab === 'adminmanagement' || activeTab === 'partner' || activeTab === 'partnerdetail'
          ? 'max-w-full px-0'
          : 'max-w-md px-[var(--space-base)]'
      }`}>
        {activeTab === 'splash' && (
          <div className="flex justify-center py-8">
            <SplashScreen 
              onGetStarted={() => alert('Get Started clicked!')}
              onSignIn={() => alert('Sign In clicked!')}
            />
          </div>
        )}
        {activeTab === 'login' && (
          <div className="flex justify-center py-8">
            <PhoneLoginScreen 
              onBack={() => alert('Back clicked!')}
              onSendOTP={(phone) => alert(`OTP sent to: ${phone}`)}
            />
          </div>
        )}
        {activeTab === 'otp' && (
          <div className="flex justify-center py-8">
            <OTPVerificationScreen 
              onBack={() => alert('Back clicked!')}
              onVerify={(otp) => alert(`OTP verified: ${otp}`)}
            />
          </div>
        )}
        {activeTab === 'home' && (
          <div className="flex justify-center py-8">
            <HomeScreen />
          </div>
        )}
        {activeTab === 'service' && (
          <div className="flex justify-center py-8">
            <ServiceDetailScreen />
          </div>
        )}
        {activeTab === 'pickup' && (
          <div className="flex justify-center py-8">
            <PickupSchedulingScreen />
          </div>
        )}
        {activeTab === 'cart' && (
          <div className="flex justify-center py-8">
            <CartReviewScreen />
          </div>
        )}
        {activeTab === 'payment' && (
          <div className="flex justify-center py-8">
            <PaymentConfirmationScreen />
          </div>
        )}
        {activeTab === 'confirmed' && (
          <div className="flex justify-center py-8">
            <OrderConfirmedScreen />
          </div>
        )}
        {activeTab === 'tracking' && (
          <div className="flex justify-center py-8">
            <OrderTrackingScreen />
          </div>
        )}
        {activeTab === 'account' && (
          <div className="flex justify-center py-8">
            <AccountScreen />
          </div>
        )}
        {activeTab === 'agent' && (
          <div className="flex justify-center py-8">
            <AgentDashboard />
          </div>
        )}
        {activeTab === 'agenttask' && (
          <div className="flex justify-center py-8">
            <AgentTaskDetailScreen />
          </div>
        )}
        {activeTab === 'agentprofile' && (
          <div className="flex justify-center py-8">
            <AgentProfileScreen />
          </div>
        )}
        {activeTab === 'agentverify' && (
          <div className="flex justify-center py-8">
            <AgentVerifyItemsScreen />
          </div>
        )}
        {activeTab === 'agentearnings' && (
          <div className="flex justify-center py-8">
            <AgentEarningsScreen />
          </div>
        )}
        {activeTab === 'admin' && (
          <div className="flex justify-center py-8">
            <AdminDashboard />
          </div>
        )}
        {activeTab === 'adminorders' && (
          <AdminOrdersPage />
        )}
        {activeTab === 'adminmanagement' && (
          <div className="flex justify-center py-8">
            <AdminManagementPage />
          </div>
        )}
        {activeTab === 'partner' && (
          <div className="flex justify-center py-8">
            <PartnerKanbanBoard />
          </div>
        )}
        {activeTab === 'partnerdetail' && (
          <div className="flex justify-center py-8">
            <PartnerOrderDetail />
          </div>
        )}
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'colors' && <ColorsTab />}
        {activeTab === 'typography' && <TypographyTab />}
        {activeTab === 'components' && <ComponentsTab />}
      </main>
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-[var(--space-2xl)] py-[var(--space-2xl)]">
      {/* Hero Section */}
      <section className="text-center space-y-[var(--space-base)]">
        <img src={logoLight} alt="Rapidry" className="h-20 mx-auto mb-[var(--space-lg)]" />
        <DisplayXL className="text-[var(--color-forest-dark)]">
          Rapidry Design System
        </DisplayXL>
        <BodyL className="text-[var(--color-text-secondary)] max-w-sm mx-auto">
          A premium, luxury-focused design system for on-demand laundry and dry cleaning services.
        </BodyL>
        <div className="flex gap-2 flex-wrap justify-center pt-[var(--space-base)]">
          <Tag>Luxury Concierge</Tag>
          <Tag variant="info">Mobile First</Tag>
          <Tag variant="success">Premium Quality</Tag>
        </div>
      </section>

      {/* Brand Personality */}
      <Card>
        <Heading2 className="text-[var(--color-forest-dark)] mb-[var(--space-md)]">
          Brand Personality
        </Heading2>
        <BodyM className="text-[var(--color-text-secondary)] mb-[var(--space-base)]">
          Rapidry is positioned as a luxury concierge service, not a delivery app. The design language emphasizes sophistication, trust, and premium quality.
        </BodyM>
        <div className="space-y-[var(--space-sm)]">
          <div className="flex items-center gap-[var(--space-sm)]">
            <div className="w-1 h-8 bg-[var(--color-gold)] rounded-full" />
            <div>
              <LabelM className="text-[var(--color-forest-dark)]">Sophisticated</LabelM>
              <Caption className="text-[var(--color-text-muted)]">Refined and elegant aesthetics</Caption>
            </div>
          </div>
          <div className="flex items-center gap-[var(--space-sm)]">
            <div className="w-1 h-8 bg-[var(--color-gold)] rounded-full" />
            <div>
              <LabelM className="text-[var(--color-forest-dark)]">Trustworthy</LabelM>
              <Caption className="text-[var(--color-text-muted)]">Professional and reliable</Caption>
            </div>
          </div>
          <div className="flex items-center gap-[var(--space-sm)]">
            <div className="w-1 h-8 bg-[var(--color-gold)] rounded-full" />
            <div>
              <LabelM className="text-[var(--color-forest-dark)]">Premium</LabelM>
              <Caption className="text-[var(--color-text-muted)]">High-end quality service</Caption>
            </div>
          </div>
        </div>
      </Card>

      {/* Logo Variations */}
      <div className="space-y-[var(--space-base)]">
        <Heading2 className="text-[var(--color-forest-dark)]">Logo Variations</Heading2>
        
        <Card className="bg-[var(--color-cream)] flex items-center justify-center py-[var(--space-3xl)]">
          <img src={logoLight} alt="Rapidry Light Logo" className="h-16" />
        </Card>
        
        <Card className="bg-[var(--color-forest-dark)] flex items-center justify-center py-[var(--space-3xl)]">
          <img src={logoDark} alt="Rapidry Dark Logo" className="h-16" />
        </Card>
        
        <Card className="bg-[var(--color-forest-mid)] flex items-center justify-center py-[var(--space-3xl)]">
          <img src={logoIcon} alt="Rapidry Icon" className="h-16" />
        </Card>
      </div>

      {/* Design Principles */}
      <div className="space-y-[var(--space-base)]">
        <Heading2 className="text-[var(--color-forest-dark)]">Design Principles</Heading2>
        <div className="grid gap-[var(--space-md)]">
          <GlassCard variant="light">
            <LabelL className="text-[var(--color-forest-dark)] block mb-2">Mobile First</LabelL>
            <BodyM className="text-[var(--color-text-secondary)]">
              Optimized for thumb-friendly interactions and one-handed use.
            </BodyM>
          </GlassCard>
          <GlassCard variant="light">
            <LabelL className="text-[var(--color-forest-dark)] block mb-2">Luxury Aesthetics</LabelL>
            <BodyM className="text-[var(--color-text-secondary)]">
              Rich colors, elegant typography, and refined spacing create premium feel.
            </BodyM>
          </GlassCard>
          <GlassCard variant="light">
            <LabelL className="text-[var(--color-forest-dark)] block mb-2">Clear Hierarchy</LabelL>
            <BodyM className="text-[var(--color-text-secondary)]">
              Playfair Display for headings, DM Sans for body creates distinct layers.
            </BodyM>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function ColorsTab() {
  const colorSections = [
    {
      title: 'Primary Colors',
      description: 'Forest green palette for backgrounds and elevated surfaces',
      colors: [
        { name: 'Forest Dark', var: '--color-forest-dark', hex: '#0F2E2A', usage: 'Backgrounds, hero sections' },
        { name: 'Forest Mid', var: '--color-forest-mid', hex: '#183F3A', usage: 'Cards on dark, elevated surfaces' },
        { name: 'Forest Light', var: '--color-forest-light', hex: '#1E4D47', usage: 'Hover states, subtle borders' }
      ]
    },
    {
      title: 'Accent Colors',
      description: 'Gold palette for CTAs, highlights, and active states',
      colors: [
        { name: 'Gold', var: '--color-gold', hex: '#D6B97B', usage: 'Primary CTAs, active states' },
        { name: 'Gold Light', var: '--color-gold-light', hex: '#E8D4A8', usage: 'Hover states, disabled gold' },
        { name: 'Gold Pale', var: '--color-gold-pale', hex: '#F5EDDA', usage: 'Tinted backgrounds' }
      ]
    },
    {
      title: 'Surface Colors',
      description: 'Cream and white for backgrounds and cards',
      colors: [
        { name: 'Cream', var: '--color-cream', hex: '#F3EFE6', usage: 'Primary light background' },
        { name: 'Cream Dark', var: '--color-cream-dark', hex: '#EAE4D8', usage: 'Cards on cream' },
        { name: 'White', var: '--color-white', hex: '#FFFFFF', usage: 'Card backgrounds' }
      ]
    },
    {
      title: 'Text Colors',
      description: 'Text hierarchy for light and dark backgrounds',
      colors: [
        { name: 'Text Primary', var: '--color-text-primary', hex: '#0F2E2A', usage: 'Body text on light' },
        { name: 'Text Secondary', var: '--color-text-secondary', hex: '#4A5568', usage: 'Subtext, labels' },
        { name: 'Text on Dark', var: '--color-text-on-dark', hex: '#F3EFE6', usage: 'All text on forest green' },
        { name: 'Text Gold', var: '--color-text-gold', hex: '#D6B97B', usage: 'Gold text on dark' },
        { name: 'Text Muted', var: '--color-text-muted', hex: '#9CAB9A', usage: 'Placeholder, disabled' }
      ]
    },
    {
      title: 'Status Colors',
      description: 'Semantic colors for system feedback',
      colors: [
        { name: 'Success', var: '--color-status-success', hex: '#15803D', usage: 'Success states' },
        { name: 'Warning', var: '--color-status-warning', hex: '#D6B97B', usage: 'Pending, warnings' },
        { name: 'Error', var: '--color-status-error', hex: '#991B1B', usage: 'Error states' },
        { name: 'Info', var: '--color-status-info', hex: '#1E3A5F', usage: 'Informational states' }
      ]
    }
  ];

  return (
    <div className="space-y-[var(--space-2xl)] py-[var(--space-2xl)]">
      <div className="space-y-[var(--space-md)]">
        <DisplayL className="text-[var(--color-forest-dark)]">Color Tokens</DisplayL>
        <BodyL className="text-[var(--color-text-secondary)]">
          Our color palette is designed to evoke luxury, trust, and sophistication.
        </BodyL>
      </div>

      {colorSections.map((section) => (
        <div key={section.title} className="space-y-[var(--space-base)]">
          <div>
            <Heading2 className="text-[var(--color-forest-dark)] mb-1">{section.title}</Heading2>
            <Caption className="text-[var(--color-text-muted)]">{section.description}</Caption>
          </div>
          
          <div className="space-y-[var(--space-sm)]">
            {section.colors.map((color) => (
              <Card key={color.name} className="p-0 overflow-hidden">
                <div className="flex">
                  <div 
                    className="w-20 h-20 flex-shrink-0"
                    style={{ backgroundColor: `var(${color.var})` }}
                  />
                  <div className="flex-1 p-[var(--space-md)]">
                    <LabelM className="text-[var(--color-forest-dark)] block mb-1">
                      {color.name}
                    </LabelM>
                    <Caption className="text-[var(--color-text-muted)] block mb-2">
                      {color.hex}
                    </Caption>
                    <Caption className="text-[var(--color-text-secondary)]">
                      {color.usage}
                    </Caption>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TypographyTab() {
  return (
    <div className="space-y-[var(--space-2xl)] py-[var(--space-2xl)]">
      <div className="space-y-[var(--space-md)]">
        <DisplayL className="text-[var(--color-forest-dark)]">Typography</DisplayL>
        <BodyL className="text-[var(--color-text-secondary)]">
          Two premium typefaces create a sophisticated hierarchy.
        </BodyL>
      </div>

      {/* Font Families */}
      <Card>
        <Heading2 className="text-[var(--color-forest-dark)] mb-[var(--space-base)]">
          Font Families
        </Heading2>
        <div className="space-y-[var(--space-base)]">
          <div>
            <LabelL className="text-[var(--color-forest-dark)] block mb-2">Playfair Display</LabelL>
            <div className="text-4xl mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              Aa Bb Cc
            </div>
            <Caption className="text-[var(--color-text-muted)]">
              Used for all headings and display text. Brings elegance and sophistication.
            </Caption>
          </div>
          <div className="h-px bg-[var(--color-cream-dark)]" />
          <div>
            <LabelL className="text-[var(--color-forest-dark)] block mb-2">DM Sans</LabelL>
            <div className="text-4xl mb-2" style={{ fontFamily: 'var(--font-body)' }}>
              Aa Bb Cc
            </div>
            <Caption className="text-[var(--color-text-muted)]">
              Used for body text, labels, and UI elements. Clean and readable.
            </Caption>
          </div>
        </div>
      </Card>

      {/* Typography Scale */}
      <div className="space-y-[var(--space-base)]">
        <Heading2 className="text-[var(--color-forest-dark)]">Typography Scale</Heading2>
        
        <Card>
          <DisplayXL className="text-[var(--color-forest-dark)] mb-2">Display XL</DisplayXL>
          <Caption className="text-[var(--color-text-muted)]">
            Playfair Display Bold, 32px, -0.5px tracking, 1.2 line-height
          </Caption>
        </Card>

        <Card>
          <DisplayL className="text-[var(--color-forest-dark)] mb-2">Display L</DisplayL>
          <Caption className="text-[var(--color-text-muted)]">
            Playfair Display Bold, 26px, -0.3px tracking, 1.25 line-height
          </Caption>
        </Card>

        <Card>
          <Heading1 className="text-[var(--color-forest-dark)] mb-2">Heading 1</Heading1>
          <Caption className="text-[var(--color-text-muted)]">
            Playfair Display SemiBold, 22px, -0.2px tracking, 1.3 line-height
          </Caption>
        </Card>

        <Card>
          <Heading2 className="text-[var(--color-forest-dark)] mb-2">Heading 2</Heading2>
          <Caption className="text-[var(--color-text-muted)]">
            Playfair Display SemiBold, 18px, 0px tracking, 1.35 line-height
          </Caption>
        </Card>

        <Card>
          <LabelL className="text-[var(--color-forest-dark)] block mb-2">Label Large</LabelL>
          <Caption className="text-[var(--color-text-muted)]">
            DM Sans SemiBold, 15px, 0.2px tracking, 1.4 line-height
          </Caption>
        </Card>

        <Card>
          <LabelM className="text-[var(--color-forest-dark)] block mb-2">Label Medium</LabelM>
          <Caption className="text-[var(--color-text-muted)]">
            DM Sans Medium, 13px, 0.15px tracking, 1.4 line-height
          </Caption>
        </Card>

        <Card>
          <LabelS className="text-[var(--color-forest-dark)] block mb-2">LABEL SMALL</LabelS>
          <Caption className="text-[var(--color-text-muted)]">
            DM Sans Medium, 11px, 0.4px tracking, 1.5 line-height
          </Caption>
        </Card>

        <Card>
          <BodyL className="text-[var(--color-text-primary)] mb-2">
            Body Large - The quick brown fox jumps over the lazy dog. Perfect for main body content.
          </BodyL>
          <Caption className="text-[var(--color-text-muted)]">
            DM Sans Regular, 15px, 0px tracking, 1.6 line-height
          </Caption>
        </Card>

        <Card>
          <BodyM className="text-[var(--color-text-primary)] mb-2">
            Body Medium - The quick brown fox jumps over the lazy dog. Perfect for secondary content.
          </BodyM>
          <Caption className="text-[var(--color-text-muted)]">
            DM Sans Regular, 13px, 0px tracking, 1.55 line-height
          </Caption>
        </Card>

        <Card>
          <Caption className="text-[var(--color-text-muted)] block mb-2">
            Caption - Used for hints, timestamps, and supplementary information.
          </Caption>
          <Caption className="text-[var(--color-text-muted)]">
            DM Sans Regular, 11px, 0.1px tracking, 1.5 line-height
          </Caption>
        </Card>
      </div>
    </div>
  );
}

function ComponentsTab() {
  const [inputValue, setInputValue] = useState('');
  const [toastVisible, setToastVisible] = useState({
    success: true,
    info: true,
    error: true,
    default: true
  });

  return (
    <div className="space-y-[var(--space-2xl)] py-[var(--space-2xl)]">
      <div className="space-y-[var(--space-md)]">
        <DisplayL className="text-[var(--color-forest-dark)]">Components</DisplayL>
        <BodyL className="text-[var(--color-text-secondary)]">
          Production-ready components built with the design system.
        </BodyL>
      </div>

      {/* Buttons */}
      <div className="space-y-[var(--space-base)]">
        <Heading2 className="text-[var(--color-forest-dark)]">Buttons</Heading2>
        <Card className="space-y-[var(--space-md)]">
          <div>
            <LabelM className="text-[var(--color-text-secondary)] block mb-2">Primary Button</LabelM>
            <Button variant="primary">Schedule Pickup</Button>
          </div>
          <div>
            <LabelM className="text-[var(--color-text-secondary)] block mb-2">Secondary Button</LabelM>
            <Button variant="secondary">View Details</Button>
          </div>
          <div>
            <LabelM className="text-[var(--color-text-secondary)] block mb-2">Ghost Button</LabelM>
            <Button variant="ghost" fullWidth={false}>Learn More</Button>
          </div>
          <div>
            <LabelM className="text-[var(--color-text-secondary)] block mb-2">Disabled State</LabelM>
            <Button variant="primary" disabled>Unavailable</Button>
          </div>
        </Card>
      </div>

      {/* Input Fields */}
      <div className="space-y-[var(--space-base)]">
        <Heading2 className="text-[var(--color-forest-dark)]">Input Fields</Heading2>
        <Card className="space-y-[var(--space-xl)]">
          <Input label="Full Name" placeholder="Enter your name" />
          <Input label="Email Address" type="email" placeholder="you@example.com" />
          <Input label="Phone Number" type="tel" placeholder="(555) 123-4567" />
          <div>
            <LabelM className="text-[var(--color-text-secondary)] block mb-2">
              Floating Label Behavior
            </LabelM>
            <Caption className="text-[var(--color-text-muted)]">
              Labels float up and scale down on focus, styled in italic Playfair Display.
            </Caption>
          </div>
        </Card>
      </div>

      {/* Tags & Chips */}
      <div className="space-y-[var(--space-base)]">
        <Heading2 className="text-[var(--color-forest-dark)]">Tags & Chips</Heading2>
        <Card>
          <div className="space-y-[var(--space-md)]">
            <div>
              <LabelM className="text-[var(--color-text-secondary)] block mb-2">Default Tags</LabelM>
              <div className="flex flex-wrap gap-2">
                <Tag>Express</Tag>
                <Tag>Premium</Tag>
                <Tag>Eco-Friendly</Tag>
                <Tag>Same Day</Tag>
              </div>
            </div>
            <div>
              <LabelM className="text-[var(--color-text-secondary)] block mb-2">Variant Tags</LabelM>
              <div className="flex flex-wrap gap-2">
                <Tag variant="success">Delivered</Tag>
                <Tag variant="warning">Pending</Tag>
                <Tag variant="error">Cancelled</Tag>
                <Tag variant="info">Processing</Tag>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Status Badges */}
      <div className="space-y-[var(--space-base)]">
        <Heading2 className="text-[var(--color-forest-dark)]">Status Badges</Heading2>
        <Card>
          <div className="space-y-[var(--space-md)]">
            <StatusBadge status="success" label="Completed" />
            <StatusBadge status="pending" label="In Progress" />
            <StatusBadge status="warning" label="Awaiting Pickup" />
            <StatusBadge status="error" label="Failed" />
            <StatusBadge status="info" label="Scheduled" />
          </div>
        </Card>
      </div>

      {/* Toast Notifications */}
      <div className="space-y-[var(--space-base)]">
        <Heading2 className="text-[var(--color-forest-dark)]">Toast Notifications</Heading2>
        <Card>
          <Caption className="text-[var(--color-text-muted)] block mb-[var(--space-base)]">
            Brief system feedback displayed at bottom of screen. Auto-dismisses after 3 seconds.
          </Caption>
          <div className="space-y-[var(--space-lg)]">
            <div>
              <LabelM className="text-[var(--color-text-secondary)] block mb-2">Success Toast</LabelM>
              <Button 
                variant="secondary" 
                fullWidth={false}
                onClick={() => setToastVisible(prev => ({ ...prev, success: true }))}
              >
                Show Success Toast
              </Button>
              <Toast 
                message="Coupon WELCOME20 applied successfully" 
                variant="success"
                isVisible={toastVisible.success}
                onDismiss={() => setToastVisible(prev => ({ ...prev, success: false }))}
              />
            </div>
            <div>
              <LabelM className="text-[var(--color-text-secondary)] block mb-2">Info Toast</LabelM>
              <Button 
                variant="secondary" 
                fullWidth={false}
                onClick={() => setToastVisible(prev => ({ ...prev, info: true }))}
              >
                Show Info Toast
              </Button>
              <Toast 
                message="OTP sent to +91 98765 43210" 
                variant="info"
                isVisible={toastVisible.info}
                onDismiss={() => setToastVisible(prev => ({ ...prev, info: false }))}
              />
            </div>
            <div>
              <LabelM className="text-[var(--color-text-secondary)] block mb-2">Error Toast</LabelM>
              <Button 
                variant="secondary" 
                fullWidth={false}
                onClick={() => setToastVisible(prev => ({ ...prev, error: true }))}
              >
                Show Error Toast
              </Button>
              <Toast 
                message="Payment failed. Please try again." 
                variant="error"
                isVisible={toastVisible.error}
                onDismiss={() => setToastVisible(prev => ({ ...prev, error: false }))}
              />
            </div>
            <div>
              <LabelM className="text-[var(--color-text-secondary)] block mb-2">Default Toast</LabelM>
              <Button 
                variant="secondary" 
                fullWidth={false}
                onClick={() => setToastVisible(prev => ({ ...prev, default: true }))}
              >
                Show Default Toast
              </Button>
              <Toast 
                message="Your order has been updated" 
                variant="default"
                isVisible={toastVisible.default}
                onDismiss={() => setToastVisible(prev => ({ ...prev, default: false }))}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Cards */}
      <div className="space-y-[var(--space-base)]">
        <Heading2 className="text-[var(--color-forest-dark)]">Cards</Heading2>
        
        <div>
          <LabelM className="text-[var(--color-text-secondary)] block mb-2">Standard Card</LabelM>
          <Card>
            <Heading2 className="text-[var(--color-forest-dark)] mb-2">
              Premium Dry Cleaning
            </Heading2>
            <BodyM className="text-[var(--color-text-secondary)] mb-[var(--space-md)]">
              Professional care for your finest garments with eco-friendly solutions.
            </BodyM>
            <div className="flex justify-between items-center">
              <LabelL className="text-[var(--color-gold)]">$24.99</LabelL>
              <Tag>Premium</Tag>
            </div>
          </Card>
        </div>

        <div>
          <LabelM className="text-[var(--color-text-secondary)] block mb-2">Active Card</LabelM>
          <Card isActive>
            <Heading2 className="text-[var(--color-forest-dark)] mb-2">
              Express Wash & Fold
            </Heading2>
            <BodyM className="text-[var(--color-text-secondary)] mb-[var(--space-md)]">
              Same-day service for everyday laundry needs.
            </BodyM>
            <StatusBadge status="success" label="Selected" />
          </Card>
        </div>

        <div>
          <LabelM className="text-[var(--color-text-secondary)] block mb-2">Glass Card (Light)</LabelM>
          <GlassCard variant="light">
            <LabelL className="text-[var(--color-forest-dark)] block mb-2">
              Glassmorphism Effect
            </LabelL>
            <BodyM className="text-[var(--color-text-secondary)]">
              Subtle backdrop blur with translucent background and gold border accent.
            </BodyM>
          </GlassCard>
        </div>
      </div>

      {/* Spacing System */}
      <div className="space-y-[var(--space-base)]">
        <Heading2 className="text-[var(--color-forest-dark)]">Spacing System</Heading2>
        <Card>
          <Caption className="text-[var(--color-text-muted)] block mb-[var(--space-base)]">
            4px base grid system
          </Caption>
          <div className="space-y-[var(--space-sm)]">
            {[
              { name: 'xs', value: '4px' },
              { name: 'sm', value: '8px' },
              { name: 'md', value: '12px' },
              { name: 'base', value: '16px' },
              { name: 'lg', value: '20px' },
              { name: 'xl', value: '24px' },
              { name: '2xl', value: '32px' },
              { name: '3xl', value: '40px' },
              { name: '4xl', value: '48px' },
              { name: 'section', value: '64px' }
            ].map((space) => (
              <div key={space.name} className="flex items-center gap-[var(--space-md)]">
                <LabelM className="text-[var(--color-text-primary)] w-16">{space.name}</LabelM>
                <div 
                  className="h-6 bg-[var(--color-gold)]"
                  style={{ width: space.value }}
                />
                <Caption className="text-[var(--color-text-muted)]">{space.value}</Caption>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Border Radius */}
      <div className="space-y-[var(--space-base)]">
        <Heading2 className="text-[var(--color-forest-dark)]">Border Radius</Heading2>
        <Card>
          <div className="space-y-[var(--space-md)]">
            {[
              { name: 'xs', value: '4px' },
              { name: 'sm', value: '8px' },
              { name: 'md', value: '12px' },
              { name: 'lg', value: '16px' },
              { name: 'xl', value: '20px' },
              { name: '2xl', value: '28px' },
              { name: 'pill', value: '999px' }
            ].map((radius) => (
              <div key={radius.name} className="flex items-center gap-[var(--space-md)]">
                <LabelM className="text-[var(--color-text-primary)] w-16">{radius.name}</LabelM>
                <div 
                  className="w-16 h-16 bg-[var(--color-gold)]"
                  style={{ borderRadius: radius.value }}
                />
                <Caption className="text-[var(--color-text-muted)]">{radius.value}</Caption>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Shadows */}
      <div className="space-y-[var(--space-base)]">
        <Heading2 className="text-[var(--color-forest-dark)]">Elevation System</Heading2>
        <div className="space-y-[var(--space-md)]">
          <div>
            <LabelM className="text-[var(--color-text-secondary)] block mb-2">Elevation 1</LabelM>
            <div 
              className="bg-[var(--color-white)] p-[var(--space-base)] rounded-[var(--radius-lg)]"
              style={{ boxShadow: 'var(--shadow-elevation-1)' }}
            >
              <BodyM className="text-[var(--color-text-secondary)]">
                Subtle shadow for cards and panels
              </BodyM>
            </div>
          </div>
          <div>
            <LabelM className="text-[var(--color-text-secondary)] block mb-2">Elevation 2</LabelM>
            <div 
              className="bg-[var(--color-white)] p-[var(--space-base)] rounded-[var(--radius-lg)]"
              style={{ boxShadow: 'var(--shadow-elevation-2)' }}
            >
              <BodyM className="text-[var(--color-text-secondary)]">
                Medium shadow for elevated cards
              </BodyM>
            </div>
          </div>
          <div>
            <LabelM className="text-[var(--color-text-secondary)] block mb-2">Elevation 3</LabelM>
            <div 
              className="bg-[var(--color-white)] p-[var(--space-base)] rounded-[var(--radius-lg)]"
              style={{ boxShadow: 'var(--shadow-elevation-3)' }}
            >
              <BodyM className="text-[var(--color-text-secondary)]">
                Strong shadow for modals and overlays
              </BodyM>
            </div>
          </div>
          <div>
            <LabelM className="text-[var(--color-text-secondary)] block mb-2">Gold Elevation</LabelM>
            <div 
              className="bg-[var(--color-white)] p-[var(--space-base)] rounded-[var(--radius-lg)]"
              style={{ boxShadow: 'var(--shadow-elevation-gold)' }}
            >
              <BodyM className="text-[var(--color-text-secondary)]">
                Premium gold glow for CTAs
              </BodyM>
            </div>
          </div>
        </div>
      </div>

      {/* Example Screen */}
      <div className="space-y-[var(--space-base)]">
        <Heading2 className="text-[var(--color-forest-dark)]">Example: Service Selection</Heading2>
        <div className="bg-[var(--color-forest-dark)] rounded-[var(--radius-xl)] p-[var(--space-xl)] space-y-[var(--space-xl)]">
          <div className="text-center">
            <img src={logoIcon} alt="Rapidry" className="h-12 mx-auto mb-[var(--space-md)]" />
            <DisplayL className="text-[var(--color-text-on-dark)] mb-2">
              Select Your Service
            </DisplayL>
            <BodyM className="text-[var(--color-text-muted)]">
              Choose the care your garments deserve
            </BodyM>
          </div>

          <GlassCard variant="dark">
            <div className="flex items-start gap-[var(--space-md)] mb-[var(--space-md)]">
              <div className="flex-1">
                <Heading2 className="text-[var(--color-text-on-dark)] mb-1">
                  Premium Dry Cleaning
                </Heading2>
                <BodyM className="text-[var(--color-text-muted)]">
                  Expert care for delicate fabrics
                </BodyM>
              </div>
              <LabelL className="text-[var(--color-gold)]">$24.99</LabelL>
            </div>
            <div className="flex gap-2">
              <Tag>Premium</Tag>
              <Tag variant="info">2-3 Days</Tag>
            </div>
          </GlassCard>

          <GlassCard variant="dark">
            <div className="flex items-start gap-[var(--space-md)] mb-[var(--space-md)]">
              <div className="flex-1">
                <Heading2 className="text-[var(--color-text-on-dark)] mb-1">
                  Wash & Fold
                </Heading2>
                <BodyM className="text-[var(--color-text-muted)]">
                  Fresh and neatly folded
                </BodyM>
              </div>
              <LabelL className="text-[var(--color-gold)]">$15.99</LabelL>
            </div>
            <div className="flex gap-2">
              <Tag variant="success">Same Day</Tag>
              <Tag variant="info">Express</Tag>
            </div>
          </GlassCard>

          <Button variant="primary">Continue to Schedule</Button>
        </div>
      </div>
    </div>
  );
}