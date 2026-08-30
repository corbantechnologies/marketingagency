# LJK Marketing Agency — Pricing Strategy & Product Architecture

## 1. Executive Overview: The LJK Bridge Model

LJK operates as the central aggregation and execution bridge between Tier-1 telecom/messaging infrastructure providers and businesses across Kenya and East Africa.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       WHOLESALE INFRASTRUCTURE LAYER                        │
│         Safaricom · Airtel · Telkom · AWS SES · Twilio · Telco Voice        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ (High-Volume Wholesale Purchasing)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             LJK CENTRAL ENGINE                              │
│       Billing & Credits · Route Failover · Template Hub · Contact Engine    │
│           REST API & Webhooks · DLR Analytics · 2-Way SMS Inboxing          │
└──────────────────────┬───────────────────────────────┬──────────────────────┘
                       │                               │
                       ▼                               ▼
       ┌───────────────────────────────┐ ┌───────────────────────────────┐
       │   SMALL BUSINESSES & SMEs     │ │   CORPORATES & ENTERPRISES    │
       │ • 3-Click Campaign Dispatch   │ │ • Custom Alphanumeric Sender  │
       │ • Excel/CSV Contact Manager   │ │ • High-Volume SMPP 3.4 Relays │
       │ • M-PESA Instant Top-Ups      │ │ • Dedicated Account Managers  │
       │ • Zero Technical Overhead     │ │ • Custom SLA & Invoicing      │
       └───────────────────────────────┘ └───────────────────────────────┘
```

---

## 2. Feature Architecture: SME Simplicity vs. Corporate Power

### A. Small Business Tier (Guiding Principle: *Simplicity & Speed*)
1. **Effortless Contact Management**:
   - 1-click Excel, CSV, and Google Sheets import.
   - Automatic Kenyan number normalization (`07...`, `01...`, `2547...` $\rightarrow$ standardized format).
   - Smart Contact Groups (e.g. *Loyal Customers*, *Kasarani Branch*, *Debtors*, *Suppliers*).
   - Automatic duplicate removal and invalid number suppression.
2. **3-Click Campaign Dispatcher**:
   - Compose SMS with real-time character counter (160 characters = 1 credit count).
   - Pre-approved dynamic templates (Holiday offers, flash sales, payment reminders, greetings).
   - Variable personalization (e.g., *"Hello {First_Name}, your balance of KSh {Amount} is due on {Date}"*).
   - Instant Send or Schedule for peak buying hours.
3. **M-PESA Instant Top-Up**:
   - Seamless STK push for immediate credit purchase (e.g., top up KSh 500, KSh 1,000, KSh 5,000).
4. **Actionable Delivery Analytics**:
   - Clear delivery telemetry: *Delivered*, *Pending*, *Failed*.
   - Instant export of delivery reports to Excel.

### B. Corporate & Enterprise Tier (Guiding Principle: *High-Volume Reliability*)
1. **Custom Alphanumeric Sender ID**: Regulator-assisted registration for official brand names.
2. **Developer REST API & Webhooks**: Seamless programmatic connection for ERPs, CRMs, e-commerce, and billing software.
3. **SMPP 3.4 Gateway Interconnect**: Low-latency multi-carrier relay for high-volume banking OTPs and notifications.
4. **2-Way SMS & Autoresponders**: Interactive keyword triggers (e.g., customer texts *"BALANCE"* or *"MENU"* $\rightarrow$ automated instant response).
5. **Team Collaboration**: Role-based access control (Admin, Campaign Manager, Billing Manager, Viewer).

---

## 3. Recommended Commercial Pricing Plans

### Summary Comparison Table (Kenyan Shillings)

| Plan Name | Category | Base Monthly Fee | SMS Rate (KES) | Email Rate (KES) | Included Credits | Max Contacts | Key Features |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Starter / PAYG** | Pay-As-You-Go | KSh 0 | **KSh 0.65** | KSh 0.06 | Pay as you go | 5,000 | Shared Sender ID, CSV Upload, M-PESA Top-up |
| **Business Growth** | Bundle / Sub | KSh 4,999 | **KSh 0.45** | KSh 0.04 | 10,000 SMS equiv. | 25,000 | 1 Branded Sender ID, Autoresponders, Click Tracking |
| **Scale & High-Volume** | Bundle / Sub | KSh 18,500 | **KSh 0.38** | KSh 0.03 | 45,000 SMS equiv. | 100,000 | 3 Branded Sender IDs, REST API, Webhooks, Priority SLA |
| **Enterprise SLA** | Custom Retainer | Custom | **KSh 0.28 – 0.35** | Negotiated | 200,000+ SMS | Unlimited | Dedicated SMPP 3.4, 99.99% SLA, Account Manager |

---

## 4. Django REST Framework (DRF) Backend Architecture

Storing plans dynamically in Django models allows administrators to adjust unit margins, create seasonal promo packages (e.g. *Easter SME Special*), and manage feature flags via Django Admin or the LJK Admin Portal without code redeployment.

### A. Django Model (`models.py`)

```python
from django.db import models
from django.utils.text import slugify


class PlanCategory(models.TextChoices):
    PAYG = "PAYG", "Pay As You Go"
    SUBSCRIPTION = "SUBSCRIPTION", "Monthly Subscription"
    BUNDLE = "BUNDLE", "Credit Bundle"
    ENTERPRISE = "ENTERPRISE", "Enterprise SLA"


class AudienceType(models.TextChoices):
    SME = "SME", "Small & Medium Business"
    CORPORATE = "CORPORATE", "Corporate & Enterprise"
    ALL = "ALL", "All Audiences"


class BillingCycle(models.TextChoices):
    ONCE = "ONCE", "One-Time Purchase"
    MONTHLY = "MONTHLY", "Monthly Recurring"
    ANNUAL = "ANNUAL", "Annual Recurring"


class SupportTier(models.TextChoices):
    COMMUNITY = "COMMUNITY", "Community / FAQ"
    EMAIL = "EMAIL", "Standard Email Support"
    PRIORITY_WHATSAPP = "PRIORITY_WHATSAPP", "Priority WhatsApp & Phone"
    DEDICATED_MANAGER = "DEDICATED_MANAGER", "Dedicated Account Manager"


class Plan(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    tagline = models.CharField(max_length=255, help_text="Short benefit statement")
    
    # Categorization & Visibility
    category = models.CharField(max_length=20, choices=PlanCategory.choices, default=PlanCategory.SUBSCRIPTION)
    target_audience = models.CharField(max_length=20, choices=AudienceType.choices, default=AudienceType.ALL)
    is_featured = models.BooleanField(default=False, help_text="Highlighted with 'Most Popular' badge")
    is_active = models.BooleanField(default=True, help_text="Publicly visible on pricing page")
    sort_order = models.PositiveIntegerField(default=0, help_text="Order in pricing list")

    # Commercials & Pricing
    price_kes = models.DecimalField(max_digits=10, decimal_places=2, help_text="Price in Kenyan Shillings")
    price_usd = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Optional USD equivalent")
    billing_cycle = models.CharField(max_length=20, choices=BillingCycle.choices, default=BillingCycle.MONTHLY)

    # Unit Rates & Quotas
    sms_rate_kes = models.DecimalField(max_digits=5, decimal_places=4, help_text="Base rate per SMS unit (e.g. 0.4500)")
    email_rate_kes = models.DecimalField(max_digits=5, decimal_places=4, help_text="Base rate per email unit (e.g. 0.0400)")
    included_sms_credits = models.PositiveIntegerField(default=0, help_text="Pre-allocated SMS credits")
    included_email_credits = models.PositiveIntegerField(default=0, help_text="Pre-allocated Email credits")

    # Feature Flags & Technical Limits
    max_contacts = models.IntegerField(default=5000, help_text="-1 indicates unlimited contacts")
    max_sender_ids = models.PositiveIntegerField(default=0, help_text="Number of custom branded Sender IDs included")
    has_api_access = models.BooleanField(default=False, help_text="Enables REST API keys and webhooks")
    has_smpp_access = models.BooleanField(default=False, help_text="Enables SMPP 3.4 gateway access")
    has_autoresponders = models.BooleanField(default=False, help_text="Enables 2-way keyword auto-reply bots")
    has_dedicated_ip = models.BooleanField(default=False, help_text="Enables dedicated IP warming for emails")
    support_tier = models.CharField(max_length=30, choices=SupportTier.choices, default=SupportTier.EMAIL)

    # Display Bullets
    features_list = models.JSONField(default=list, help_text="List of feature bullet points as JSON strings")
    badge_text = models.CharField(max_length=60, null=True, blank=True, help_text="e.g. 'Most Popular for Retail'")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "price_kes"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} — KSh {self.price_kes}"
```

---

### B. DRF Serializer (`serializers.py`)

```python
from rest_framework import serializers
from .models import Plan


class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = [
            "id",
            "name",
            "slug",
            "tagline",
            "category",
            "target_audience",
            "is_featured",
            "is_active",
            "sort_order",
            "price_kes",
            "price_usd",
            "billing_cycle",
            "sms_rate_kes",
            "email_rate_kes",
            "included_sms_credits",
            "included_email_credits",
            "max_contacts",
            "max_sender_ids",
            "has_api_access",
            "has_smpp_access",
            "has_autoresponders",
            "has_dedicated_ip",
            "support_tier",
            "features_list",
            "badge_text",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
```

---

### C. DRF ViewSet & URL Routing (`views.py` & `urls.py`)

```python
from rest_framework import viewsets, permissions
from .models import Plan
from .serializers import PlanSerializer


class PlanViewSet(viewsets.ModelViewSet):
    """
    Public users: GET active plans
    Admin users: Full CRUD access
    """
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer
    lookup_field = "slug"

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [perm() for perm in permission_classes]

    def get_queryset(self):
        queryset = super().get_queryset()
        # Non-admins only see active plans
        if not (self.request.user and self.request.user.is_staff):
            queryset = queryset.filter(is_active=True)
        return queryset
```

---

### D. Next.js Frontend TypeScript Interface (`types/plan.ts`)

```typescript
export interface Plan {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  category: "PAYG" | "SUBSCRIPTION" | "BUNDLE" | "ENTERPRISE";
  target_audience: "SME" | "CORPORATE" | "ALL";
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;

  price_kes: string | number;
  price_usd?: string | number | null;
  billing_cycle: "ONCE" | "MONTHLY" | "ANNUAL";

  sms_rate_kes: string | number;
  email_rate_kes: string | number;
  included_sms_credits: number;
  included_email_credits: number;

  max_contacts: number;
  max_sender_ids: number;
  has_api_access: boolean;
  has_smpp_access: boolean;
  has_autoresponders: boolean;
  has_dedicated_ip: boolean;
  support_tier: "COMMUNITY" | "EMAIL" | "PRIORITY_WHATSAPP" | "DEDICATED_MANAGER";

  features_list: string[];
  badge_text?: string | null;
}
```

---

## 5. Payment & Credit Ledger Flow with Django

```
User Selects Plan / Top-Up
           │
           ▼
[ Frontend Calls DRF POST /api/payments/mpesa/stk-push/ ]
           │
           ▼
[ Django Backend Calls Safaricom Daraja API ]
           │
           ▼
[ Safaricom Sends STK Push to User Handset ]
           │
           ▼ (User Enters M-PESA PIN)
[ Safaricom Callback Webhook ──▶ DRF /api/payments/mpesa/callback/ ]
           │
           ▼
[ Django Transaction & Ledger Service ]
• Verifies ResultCode == 0 and MpesaReceiptNumber
• Atomically increments BusinessWallet.sms_balance
• Dispatches SMS receipt to customer
```

---

## 6. Admin Governance & Commercial Controls

From Django Admin (`/admin/`) or the LJK Admin Portal (`/admin/plans`), administrators can:
1. **Modify Unit Margins**: Adjust `sms_rate_kes` (e.g. from `0.4500` to `0.4200`) when telco wholesale rates drop.
2. **Create Flash Bundles**: Spin up seasonal packages (e.g., *"Easter 50k SMS Bundle @ KSh 17,500"* with `category="BUNDLE"`).
3. **Custom Corporate Pricing**: Create private plans (`is_active=False` or restricted target audience) assigned specifically to enterprise client accounts.
4. **Feature Gating**: Instantly toggle `has_api_access`, `has_smpp_access`, or `max_sender_ids` per business tier.
