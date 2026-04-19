# RAPIDRY Blog Posting Guide

## 1. Access Sanity Studio
1. Open the local Studio URL: `http://localhost:3335/`.
2. Log in with your Sanity account that has access to project `BLOGS`.
3. In the left content list, click `Blog Post`.

Screenshot description:
- Top left shows RAPIDRY/BLOGS workspace.
- Left sidebar shows document type `Blog Post`.
- Main panel shows list of posts.

## 2. Create a New Blog Post
1. In `Blog Post`, click `Create new`.
2. Fill fields in this order:
1. `Title`
2. `Slug` (click Generate if needed)
3. `Excerpt` (max 200 chars)
4. `Content`
5. `Author`
6. `Date`
7. `Read Time`
8. `Cover Image` (optional)
9. `Tags`

Screenshot description:
- Editor form with all fields in a single right-side document pane.
- Publish button at the top right.

## 3. Add Images
1. Go to `Cover Image`.
2. Click `Upload`.
3. Select an image file.
4. Adjust hotspot if needed for better crop framing.

Screenshot description:
- Image upload area with preview and hotspot control overlay.

## 4. Format Text in Content
Use the rich text toolbar in `Content`:
1. Headings: choose `H2` or `H3` from block style dropdown.
2. Bold: select text and click Bold.
3. Lists: click Bullet list and add list items.
4. Paragraphs: keep normal style for body text.

Screenshot description:
- Content editor with toolbar for heading styles, bold, and list controls.

## 5. Add Tags
1. In `Tags`, press Enter after each tag.
2. Use short, relevant tags like `Laundry Tips`, `Dry Cleaning`, `Shirt Care`.

Screenshot description:
- Tags input shown as chips/pills inside the tags field.

## 6. Publish / Unpublish
1. Click `Publish` to make the post live.
2. To unpublish later, open the post actions menu and choose `Unpublish`.

Screenshot description:
- Top-right action area with Publish button and document actions menu.

## 7. Edit Existing Posts
1. Open `Blog Post` list.
2. Click any existing post.
3. Update fields.
4. Click `Publish` again to apply updates live.

Screenshot description:
- Existing post selected in list with edited fields in main form.

## 8. Go-Live Timing
- Expected live update time: about **60 seconds** after publishing.
- In many cases updates appear sooner.

## 9. Troubleshooting: My Post Is Not Showing Up
1. Confirm post is **Published**, not draft-only.
2. Confirm required fields are filled: Title, Slug, Excerpt, Content, Date.
3. Confirm you are editing in project `BLOGS` and dataset `production`.
4. Refresh `/blog` and wait 60 seconds.
5. Check that Sanity webhook is enabled and points to Vercel deploy hook.
6. Check latest deployment status in Vercel dashboard.
7. If still missing, reopen the post and republish once.
