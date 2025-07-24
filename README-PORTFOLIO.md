# Portfolio Upload System

A complete architecture portfolio upload system built with React Hook Form, Zod validation, and ShadCN UI components.

## Features

- 🎨 **Modern UI** - Clean, responsive interface using ShadCN UI components
- ✅ **Form Validation** - React Hook Form with Zod schema validation
- 📸 **Image Upload** - Drag-and-drop image upload with preview
- 🔄 **Image Reordering** - Drag-and-drop to reorder uploaded images
- 📱 **Responsive Design** - Mobile-friendly interface
- 🛡️ **Authentication** - Protected admin routes
- 🎯 **Type Safety** - Full TypeScript support

## File Structure

```
app/admin/
├── page.tsx                 # Main admin dashboard with project list
├── login/
│   └── page.tsx            # Admin login page
└── uploads/
    └── page.tsx            # Portfolio upload page

components/ui/
└── image-upload.tsx        # Image upload component with drag-and-drop

hooks/
└── use-cloudinary-upload.ts # Cloudinary upload hook (demo mode)

lib/validations/
└── auth.ts                 # Portfolio form validation schema

app/api/portfolio/
└── route.ts                # Portfolio API (GET for list, POST for create)
```

## Form Fields

### Required Fields
- **Title** - Project title (min 3 characters)
- **Description** - Project description (min 10 characters)
- **Images** - At least 1 image, maximum 10 images

### Optional Fields
- **Category** - Project category (e.g., Residential, Commercial)
- **Tags** - Comma-separated tags for categorization
- **Completion Date** - Project completion date

## Image Upload Features

### Drag-and-Drop Upload
- Drag images directly onto the upload area
- Multiple file selection support
- File type validation (JPEG, PNG, WEBP)
- File size validation (max 10MB per image)

### Image Management
- Preview all uploaded images
- Drag-and-drop to reorder images
- Remove individual images
- Progress indicator during upload
- Image dimensions display on hover

### Supported Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- Maximum file size: 10MB per image
- Maximum images: 10 per project

## Validation Schema

```typescript
const portfolioSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  category: z.string().optional(),
  tags: z.string().optional(),
  completionDate: z.string().optional(),
  images: z.array(z.object({
    url: z.string().url(),
    public_id: z.string(),
    width: z.number().positive(),
    height: z.number().positive(),
  })).min(1).max(10),
})
```

## API Endpoint

### GET /api/portfolio

Retrieves all portfolio entries for authenticated admin users.

**Response:**
```json
{
  "message": "Portfolio entries retrieved successfully",
  "data": [
    {
      "id": "1",
      "slug": "modern-residential-complex",
      "title": "Modern Residential Complex",
      "description": "A sustainable residential project...",
      "category": "Residential",
      "tags": "sustainable, modern, residential",
      "completionDate": "2024-01-15",
      "images": [...],
      "createdAt": "2024-01-20T10:00:00.000Z",
      "updatedAt": "2024-01-20T10:00:00.000Z"
    }
  ]
}
```

### POST /api/portfolio

Creates a new portfolio entry with the following payload:

```json
{
  "title": "Modern Residential Complex",
  "description": "A sustainable residential project...",
  "category": "Residential",
  "tags": "sustainable, modern, residential",
  "completionDate": "2024-01-15",
  "images": [
    {
      "url": "https://res.cloudinary.com/...",
      "public_id": "portfolio/project_1",
      "width": 1920,
      "height": 1080
    }
  ]
}
```

### Response

```json
{
  "message": "Portfolio entry created successfully",
  "data": {
    "id": "1234567890",
    "slug": "modern-residential-complex",
    "title": "Modern Residential Complex",
    "description": "A sustainable residential project...",
    "category": "Residential",
    "tags": "sustainable, modern, residential",
    "completionDate": "2024-01-15",
    "images": [...],
    "createdAt": "2024-01-20T10:00:00.000Z",
    "updatedAt": "2024-01-20T10:00:00.000Z"
  }
}
```

## Usage

### Admin Dashboard

1. **Login** - Navigate to `/admin/login` and enter admin credentials
2. **Dashboard** - After login, you'll see the main admin dashboard at `/admin`
3. **Project List** - View all uploaded portfolio projects with thumbnails
4. **Upload** - Click "Upload New Project" to add new projects

### Admin Dashboard Features

- **Header with Actions**
  - "Upload New Project" button → navigates to `/admin/uploads`
  - "Sign Out" button → logs out and redirects to login
- **Project Grid**
  - Displays all portfolio projects in a responsive grid
  - Shows project title, category, description preview
  - First image as thumbnail preview
  - Project metadata (image count, completion date)
- **Loading States**
  - Skeleton loading while fetching projects
  - Error handling with retry option
  - Empty state with call-to-action for first project

### Accessing the Upload Page

1. Login to admin dashboard at `/admin/login`
2. From dashboard, click "Upload New Project" button
3. Fill in project details
4. Upload and arrange images
5. Submit the form
6. Return to dashboard to see your new project

### Form Workflow

1. **Project Details** - Enter title and description
2. **Additional Details** - Add category, tags, and completion date
3. **Image Upload** - Drag-and-drop or select images
4. **Image Management** - Reorder and remove images as needed
5. **Submit** - Create the portfolio entry

## Demo Mode

Currently running in demo mode with simulated Cloudinary uploads:
- Images are stored as blob URLs for preview
- Mock upload progress simulation
- No actual cloud storage integration

## Production Setup

To enable real Cloudinary uploads:

1. **Environment Variables**
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=portfolio_uploads
   ```

2. **Cloudinary Configuration**
   - Create upload preset named "portfolio_uploads"
   - Configure folder structure: "portfolio/"
   - Set appropriate file size and type restrictions

3. **Update Upload Hook**
   - Replace mock upload with real Cloudinary API calls
   - Update the cloud name in the upload URL
   - Handle real upload responses

## Security Features

- **Authentication Required** - Only authenticated admins can upload
- **File Validation** - Type and size restrictions
- **Input Sanitization** - Zod schema validation
- **Error Handling** - Comprehensive error messages
- **Rate Limiting** - Built-in upload progress tracking

## Styling

- **ShadCN UI Components** - Consistent design system
- **Tailwind CSS** - Utility-first styling
- **Responsive Design** - Mobile-first approach
- **Dark Mode Support** - Theme-aware components
- **Accessibility** - ARIA labels and keyboard navigation

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access upload page
http://localhost:3000/admin/uploads
```

## Future Enhancements

- [ ] Real Cloudinary integration
- [ ] Image editing capabilities
- [ ] Bulk upload support
- [ ] Portfolio management dashboard
- [ ] SEO optimization for portfolio entries
- [ ] Social media sharing
- [ ] Portfolio analytics
