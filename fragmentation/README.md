# Fragmentation Directory

This directory tracks code patches and updates across different branches and versions of the FoalTS repository.

## Purpose

The fragmentation system allows us to:
1. **Track patches** - Record all code changes as discrete, documented patches
2. **Trace origins** - Know which branch a patch originated from
3. **Apply to branches** - Easily apply patches to different branches (e.g., master, release branches)
4. **Update tracking** - Automatically update branch references when patches are successfully applied
5. **Version management** - Keep records of code fragmentation across different repository versions

## Structure

Each patch is documented in a separate markdown file with the naming convention:
```
<patch-id>.md
```

For example:
- `route-shadowing-fix.md` - Documents the route shadowing fix patch

## Patch File Format

Each patch markdown file contains:

### Metadata Section
- **Patch ID**: Unique identifier for the patch
- **Created Date**: When the patch was created
- **Original Branch**: Branch where the patch was first implemented
- **Status**: Active, Applied, Deprecated, etc.
- **Latest Applied Branch**: Last branch this patch was applied to

### Content Sections
- **Problem Statement**: Description of the issue being fixed
- **Solution Summary**: High-level overview of the fix
- **Changes Made**: Detailed list of file modifications
- **Commit History**: List of commits that make up this patch
- **Key Implementation Details**: Technical details
- **Testing**: Test coverage and results
- **Branch Application History**: Table tracking which branches have this patch

### Operational Sections
- **How to Apply This Patch to Another Branch**: Step-by-step instructions
- **Validation Checklist**: What to verify after applying
- **Dependencies**: Any external dependencies
- **Rollback Instructions**: How to undo the patch if needed

## Workflow

### Creating a New Patch
1. Implement your changes in a feature branch
2. Create a new markdown file in `fragmentation/` with a descriptive name
3. Fill in all sections, especially metadata and commit hashes
4. Commit the markdown file with your changes

### Applying a Patch to a New Branch
1. Read the patch markdown file
2. Follow the "How to Apply This Patch to Another Branch" instructions
3. Run all validation checks
4. Update the patch file:
   - Add entry to "Applied to Branches" table
   - Update "Latest Applied Branch" in metadata
   - Commit the updated markdown file

### Example Application
```bash
# 1. Read the patch file
cat fragmentation/route-shadowing-fix.md

# 2. Checkout target branch
git checkout master

# 3. Cherry-pick the commits (from the patch file)
git cherry-pick 823b919 374b020 f5b1488 0c92eb2

# 4. Validate
cd packages/core && npm test && npm run lint

# 5. Update the patch file
# Edit fragmentation/route-shadowing-fix.md to add new branch entry

# 6. Commit the update
git add fragmentation/route-shadowing-fix.md
git commit -m "Update patch tracking: applied route-shadowing-fix to master"
```

## Benefits

1. **Traceability**: Know exactly what changed, when, and where
2. **Reusability**: Easily apply the same fix to multiple branches
3. **Documentation**: Self-documenting patches with context and instructions
4. **Version Control**: Track patch evolution across repository versions
5. **Collaboration**: Team members can understand and apply patches independently

## Best Practices

1. **One Patch, One File**: Each logical change should be a separate patch file
2. **Update Promptly**: Update the patch file immediately after applying to a new branch
3. **Complete Information**: Fill in all sections thoroughly
4. **Test Before Updating**: Only mark a patch as applied after successful testing
5. **Keep History**: Never delete old patch entries, just update status

## Integration with Git

While Git has built-in patch functionality (`git format-patch`, `git am`), this fragmentation system adds:
- Human-readable documentation
- Branch tracking metadata
- Application history
- Validation checklists
- Rollback instructions

## Files in This Directory

- `README.md` - This file, explaining the fragmentation system
- `route-shadowing-fix.md` - Patch for fixing route shadowing issue
- Additional patch files as they are created...

## Questions?

If you have questions about this system or need help applying a patch, refer to the specific patch markdown file or consult with the team.
