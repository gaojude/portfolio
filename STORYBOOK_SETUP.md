# Storybook and Chromatic Integration Setup

This document describes the Storybook and Chromatic integration that has been set up for the portfolio application.

## What's Been Implemented

### 1. Storybook Configuration
- **Framework**: @storybook/nextjs (v8.5.0) - specifically configured for Next.js applications
- **Addons**:
  - `@storybook/addon-essentials` - Core functionality (controls, actions, docs, etc.)
  - `@storybook/addon-interactions` - For testing user interactions
  - `@storybook/addon-links` - For linking between stories
  - `@storybook/addon-onboarding` - Getting started guide

### 2. Stories Created
- **Spinner Component** (`stories/chat/Spinner.stories.tsx`)
  - Basic loading spinner used throughout the chat interface
  
- **Chat Page Layout** (`stories/chat/ChatPageLayout.stories.tsx`)
  - Complete chat page with different states:
    - Empty state (no conversations, no personal context)
    - With conversations
    - With personal context
    - Full state (both conversations and personal context)
  
- **Message Components** (`stories/chat/MessageComponents.stories.tsx`)
  - User message wrapper with different message types
  - Tool call wrapper for AI tool interactions

### 3. Chromatic Integration
- **GitHub Actions Workflow** (`.github/workflows/chromatic.yml`)
  - Automated visual testing on pull requests and main branch pushes
  - Uses pnpm for dependency management
  - Publishes to Chromatic on every build

## Required Secrets and Environment Variables

### Repository Secrets (Required)
You need to set the following secret in your GitHub repository:

1. **`CHROMATIC_PROJECT_TOKEN`**
   - **Where to get it**: Sign up at [chromatic.com](https://chromatic.com) and create a new project
   - **How to add**: Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret
   - **Name**: `CHROMATIC_PROJECT_TOKEN`
   - **Value**: The project token from your Chromatic project settings

### How to Set Up Chromatic

1. **Create Chromatic Account**:
   - Go to [chromatic.com](https://chromatic.com)
   - Sign up using your GitHub account
   - This will give you access to visual testing and review tools

2. **Create New Project**:
   - Click "Add project" in Chromatic dashboard
   - Select your GitHub repository (`gaojude/portfolio`)
   - Chromatic will generate a project token

3. **Add Secret to GitHub**:
   - Go to your repo: Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `CHROMATIC_PROJECT_TOKEN`
   - Value: Paste the token from Chromatic
   - Click "Add secret"

## Available Scripts

After the dependencies are installed, you can use these commands:

```bash
# Start Storybook development server
pnpm storybook

# Build Storybook for production
pnpm build-storybook

# Run Chromatic CLI (requires CHROMATIC_PROJECT_TOKEN)
pnpm chromatic
```

## How It Works

### Development Workflow
1. **Create Stories**: Add `.stories.tsx` files in the `stories/` directory
2. **Run Storybook**: Use `pnpm storybook` to develop and test components in isolation
3. **Visual Testing**: Push changes to trigger Chromatic visual regression testing
4. **Review**: Chromatic will detect visual changes and require approval

### Continuous Integration
- **On Pull Requests**: Chromatic runs visual tests and reports changes
- **On Main Branch**: Builds are published as new baselines
- **Visual Changes**: Require manual approval in Chromatic dashboard

## Component Documentation

The Storybook includes:
- **Interactive Controls**: Modify props in real-time
- **Documentation**: Auto-generated from TypeScript types
- **Multiple Variants**: Different states and configurations
- **Responsive Testing**: View components at different screen sizes

## Next Steps

1. **Set the Chromatic secret** (as described above)
2. **Install dependencies**: `pnpm install`
3. **Start Storybook**: `pnpm storybook`
4. **Add more stories**: Create stories for other components as needed
5. **Visual testing**: Push changes to see Chromatic in action

## Troubleshooting

### Common Issues
- **Missing secret**: Chromatic workflow will fail without `CHROMATIC_PROJECT_TOKEN`
- **Build failures**: Ensure all dependencies are installed with `pnpm install`
- **TypeScript errors**: Check that all imports in stories match actual component paths

### Storybook Not Loading
- Check that CSS files are correctly imported in `.storybook/preview.ts`
- Verify that all component dependencies are available
- Look for console errors in browser dev tools