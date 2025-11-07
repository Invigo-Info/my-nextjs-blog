# CMS & Email Integration Guide

This guide explains how to integrate your BlogHub application with real CMS and email services.

## Current Implementation

The blog currently uses a **file-based content system** with:
- JSON data file (`/data/posts.json`)
- API routes for data fetching
- Full search and filtering capabilities

## 🔌 Integrating with Email Services

### Newsletter Subscription

The newsletter API route is located at `/app/api/newsletter/route.ts`.

#### Option 1: Resend (Recommended)

```bash
npm install resend
```

Update `/app/api/newsletter/route.ts`:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    await resend.contacts.create({
      email: email,
      audienceId: process.env.RESEND_AUDIENCE_ID!,
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter!',
    });
  } catch (error) {
    // Error handling...
  }
}
```

Environment variables needed:
```env
RESEND_API_KEY=re_...
RESEND_AUDIENCE_ID=...
```

#### Option 2: Mailchimp

```bash
npm install @mailchimp/mailchimp_marketing
```

```typescript
import mailchimp from '@mailchimp/mailchimp_marketing';

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID!, {
  email_address: email,
  status: 'subscribed',
});
```

#### Option 3: ConvertKit

```bash
npm install @convertkit/convertkit-js
```

### Contact Form

The contact form API route is at `/app/api/contact/route.ts`.

#### Option 1: Resend (Send Email)

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { name, email, message } = await request.json();

  await resend.emails.send({
    from: 'contact@yourdomain.com',
    to: 'your-email@example.com',
    replyTo: email,
    subject: `Contact form submission from ${name}`,
    text: message,
  });

  return NextResponse.json({
    success: true,
    message: 'Thank you for your message! We will get back to you soon.',
  });
}
```

#### Option 2: SendGrid

```bash
npm install @sendgrid/mail
```

```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

await sgMail.send({
  to: 'your-email@example.com',
  from: 'contact@yourdomain.com',
  replyTo: email,
  subject: `Contact form from ${name}`,
  text: message,
});
```

## 📝 Migrating to a Headless CMS

### Option 1: Contentful

1. **Install SDK**:
```bash
npm install contentful
```

2. **Create API utility** (`/lib/contentful.ts`):
```typescript
import { createClient } from 'contentful';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

export async function getPosts() {
  const entries = await client.getEntries({
    content_type: 'blogPost',
  });

  return entries.items.map(item => ({
    id: item.sys.id,
    slug: item.fields.slug,
    title: item.fields.title,
    excerpt: item.fields.excerpt,
    content: item.fields.content,
    category: item.fields.category,
    author: item.fields.author,
    date: item.fields.date,
    readTime: item.fields.readTime,
    tags: item.fields.tags,
  }));
}
```

3. **Update API route** (`/app/api/posts/route.ts`):
```typescript
import { getPosts } from '@/lib/contentful';

export async function GET(request: Request) {
  const posts = await getPosts();
  // Apply filters...
  return NextResponse.json(posts);
}
```

### Option 2: Strapi (Self-hosted)

1. **Setup Strapi** (separate project):
```bash
npx create-strapi-app@latest my-blog-cms
```

2. **Install client**:
```bash
npm install axios
```

3. **Fetch from Strapi API**:
```typescript
import axios from 'axios';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

export async function getPosts() {
  const { data } = await axios.get(`${STRAPI_URL}/api/posts?populate=*`);
  return data.data.map(item => ({
    id: item.id,
    ...item.attributes,
  }));
}
```

### Option 3: Sanity

1. **Install SDK**:
```bash
npm install @sanity/client
```

2. **Create client** (`/lib/sanity.ts`):
```typescript
import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: true,
  apiVersion: '2024-01-01',
});

export async function getPosts() {
  return await client.fetch(`
    *[_type == "post"] | order(date desc) {
      _id,
      title,
      slug,
      excerpt,
      content,
      category,
      author,
      date,
      readTime,
      tags
    }
  `);
}
```

## 🔄 Migration Steps

1. **Choose your CMS/Email service**
2. **Install required packages**
3. **Set up environment variables** in `.env.local`:
   ```env
   # Email Service (choose one)
   RESEND_API_KEY=your_key
   SENDGRID_API_KEY=your_key
   MAILCHIMP_API_KEY=your_key

   # CMS (choose one)
   CONTENTFUL_SPACE_ID=your_space_id
   CONTENTFUL_ACCESS_TOKEN=your_token

   # Or Sanity
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

4. **Update API routes** to use real services
5. **Test thoroughly**
6. **Deploy** with environment variables configured

## 📚 Current Features

✅ **Blog Post Management**
- JSON-based content storage
- API routes for fetching posts
- Dynamic routing for individual posts

✅ **Search & Filtering**
- Full-text search across titles, excerpts, and tags
- Category-based filtering
- Real-time client-side filtering

✅ **Forms**
- Newsletter subscription with API integration
- Contact form with validation
- Success/error state management

✅ **UI/UX**
- Responsive design
- Smooth animations with Framer Motion
- Dark mode support
- Loading states

## 🚀 Next Steps

1. Choose your preferred CMS and email service
2. Follow the integration guide above
3. Test with real data
4. Configure production environment variables
5. Deploy to Vercel/your hosting platform

## 📖 Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [Contentful Documentation](https://www.contentful.com/developers/docs/)
- [Strapi Documentation](https://docs.strapi.io/)
- [Sanity Documentation](https://www.sanity.io/docs)
- [SendGrid Documentation](https://docs.sendgrid.com/)
