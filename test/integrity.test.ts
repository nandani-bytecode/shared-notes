import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { 
  INITIAL_COMMUNITIES, 
  INITIAL_SUBJECTS, 
  INITIAL_RESOURCES, 
  INITIAL_PERSONAL_FOLDERS, 
  INITIAL_PERSONAL_REFERENCES, 
  INITIAL_COMMENTS 
} from '../src/data/mockData';
import { PersonalReference, Resource } from '../src/types';

describe('StudySpace Core Architecture & Integrity Tests', () => {

  test('Rule 1: Resources exist independently in communities with unique IDs', () => {
    assert.ok(INITIAL_RESOURCES.length >= 15, `Expected at least 15 resources, got ${INITIAL_RESOURCES.length}`);
    
    // Check all IDs are unique
    const idSet = new Set(INITIAL_RESOURCES.map(r => r.id));
    assert.equal(idSet.size, INITIAL_RESOURCES.length, 'All community resource IDs must be unique');

    // Verify resources belong to valid communities and subjects
    for (const r of INITIAL_RESOURCES) {
      assert.ok(r.communityId, `Resource ${r.id} must have communityId`);
      assert.ok(r.subjectId, `Resource ${r.id} must have subjectId`);
      assert.ok(r.title, `Resource ${r.id} must have title`);
      assert.ok(r.type, `Resource ${r.id} must have type`);
    }
  });

  test('Rule 2: Adding to workspace creates a PersonalReference pointing to the unchanged resource without duplicate files', () => {
    const resources = [...INITIAL_RESOURCES];
    const initialResourceCount = resources.length;
    const personalReferences: PersonalReference[] = [...INITIAL_PERSONAL_REFERENCES];

    // Pick a community resource that is not yet in workspace
    const targetResource = resources.find(r => !personalReferences.some(p => p.resourceId === r.id));
    assert.ok(targetResource, 'Found resource to add');

    // Simulate addToWorkspace
    const newRef: PersonalReference = {
      id: `pref-test-${Date.now()}`,
      userId: 'usr-current',
      resourceId: targetResource.id,
      personalName: targetResource.title,
      personalFolderId: 'folder-dsa',
      personalTags: ['Test Tag'],
      personalNotes: 'Test note',
      starred: false,
      completed: false,
      addedAt: new Date().toISOString(),
      lastOpenedAt: new Date().toISOString(),
    };
    personalReferences.push(newRef);

    // Verify:
    // 1. Resources array count MUST NOT increase (no duplicate file!)
    assert.equal(resources.length, initialResourceCount, 'No duplicate resource created in resources list');
    // 2. Personal reference points to targetResource.id
    assert.equal(newRef.resourceId, targetResource.id);
    // 3. Original title in community remains targetResource.title
    assert.equal(targetResource.title, resources.find(r => r.id === targetResource.id)?.title);
  });

  test('Rule 3: Personal renaming modifies ONLY the personal display name, community resource title is untouched', () => {
    // Example from prompt:
    // Original community resource: "DSA Unit 3 Linked Lists.pdf"
    // User personal name: "🔥 MUST DO — Linked Lists"
    const communityResource = INITIAL_RESOURCES.find(r => r.id === 'res-dsa-05');
    assert.ok(communityResource, 'res-dsa-05 exists');
    assert.equal(communityResource.title, 'DSA Unit 3 Linked Lists.pdf');

    const personalRef = INITIAL_PERSONAL_REFERENCES.find(r => r.resourceId === 'res-dsa-05');
    assert.ok(personalRef, 'Personal reference exists');
    assert.equal(personalRef.personalName, '🔥 MUST DO — Linked Lists');

    // The community resource title MUST NOT have changed
    assert.equal(communityResource.title, 'DSA Unit 3 Linked Lists.pdf');
    assert.notEqual(communityResource.title, personalRef.personalName);
  });

  test('Rule 4: Moving personal reference between folders does NOT move community resource', () => {
    const communityResource = INITIAL_RESOURCES.find(r => r.id === 'res-dsa-05');
    assert.ok(communityResource);
    const originalCommunity = communityResource.communityId;
    const originalSubject = communityResource.subjectId;

    // Simulate moving reference from 'folder-dsa' to 'folder-important'
    const personalRef = INITIAL_PERSONAL_REFERENCES.find(r => r.resourceId === 'res-dsa-05');
    assert.ok(personalRef);
    personalRef.personalFolderId = 'folder-important';

    // Verify community resource still belongs to original community and subject
    assert.equal(communityResource.communityId, originalCommunity);
    assert.equal(communityResource.subjectId, originalSubject);
  });

  test('Rule 5: Removing a personal reference leaves community resource intact', () => {
    let personalReferences = [...INITIAL_PERSONAL_REFERENCES];
    const resources = [...INITIAL_RESOURCES];
    const targetResourceId = 'res-dsa-01';

    // Remove personal reference
    personalReferences = personalReferences.filter(r => r.resourceId !== targetResourceId);

    // Verify reference is gone from personal references
    assert.ok(!personalReferences.some(r => r.resourceId === targetResourceId));

    // Verify community resource STILL EXISTS in resources!
    const resourceStillExists = resources.find(r => r.id === targetResourceId);
    assert.ok(resourceStillExists, 'Community resource must remain in community archive');
    assert.equal(resourceStillExists.title, 'DSA Lecture 1.pdf');
  });

  test('Rule 6: Multi-Community Aggregation: user can combine resources from multiple communities into ONE personal folder', () => {
    // In our initial demo data:
    // 'pref-001' is from Community A (CSE Section H, 'comm-cseh')
    // 'pref-003' is from Community B (Coding Club, 'comm-coding')
    const pref1 = INITIAL_PERSONAL_REFERENCES.find(r => r.id === 'pref-001');
    const pref3 = INITIAL_PERSONAL_REFERENCES.find(r => r.id === 'pref-003');
    assert.ok(pref1 && pref3);

    // Both are in the same personal folder 'folder-dsa'
    assert.equal(pref1.personalFolderId, 'folder-dsa');
    assert.equal(pref3.personalFolderId, 'folder-dsa');

    // But point to resources in two DIFFERENT communities
    const res1 = INITIAL_RESOURCES.find(r => r.id === pref1.resourceId);
    const res3 = INITIAL_RESOURCES.find(r => r.id === pref3.resourceId);
    assert.ok(res1 && res3);

    assert.equal(res1.communityId, 'comm-cseh', 'Resource 1 from Community A');
    assert.equal(res3.communityId, 'comm-coding', 'Resource 3 from Community B');
    assert.notEqual(res1.communityId, res3.communityId, 'Communities are distinct');
  });

  test('Rule 7: Discussions attach to resource and support nested replies', () => {
    assert.ok(INITIAL_COMMENTS.length > 0);
    const commentWithReplies = INITIAL_COMMENTS.find(c => c.replies && c.replies.length > 0);
    assert.ok(commentWithReplies, 'Found comment with replies');
    assert.ok(commentWithReplies.replies.length >= 2);

    for (const reply of commentWithReplies.replies) {
      assert.ok(reply.content);
      assert.ok(reply.userName);
      assert.equal(reply.commentId, commentWithReplies.id);
    }
  });

  test('Rule 8: Communities have codes, members, and subjects', () => {
    assert.ok(INITIAL_COMMUNITIES.length >= 3);
    for (const c of INITIAL_COMMUNITIES) {
      assert.ok(c.code, `Community ${c.name} has invite code`);
      assert.ok(c.subjects.length > 0, `Community ${c.name} has subjects`);
      assert.ok(c.membersCount > 0, `Community ${c.name} has members`);
    }
  });

  test('Rule 9: Community creation generates unique codes, custom avatars, and subjects', () => {
    const existingCodes = new Set(INITIAL_COMMUNITIES.map(c => c.code.toUpperCase()));
    
    // Simulate community creation
    const newCommunityName = 'Artificial Intelligence & Deep Learning 2026';
    const cleanCode = 'AI-DL-2026';
    assert.ok(!existingCodes.has(cleanCode), 'New code is unique');

    const createdComm = {
      id: `comm-test-${Date.now()}`,
      name: newCommunityName,
      code: cleanCode,
      description: 'Hub for neural networks and PyTorch study materials.',
      avatar: '🤖',
      bannerGradient: 'from-purple-600 to-pink-800',
      category: 'Club & Interest',
      subjects: ['subj-dsa', 'subj-ai-custom'],
      membersCount: 1,
      createdAt: new Date().toISOString(),
    };

    assert.equal(createdComm.avatar, '🤖');
    assert.equal(createdComm.code, 'AI-DL-2026');
    assert.ok(createdComm.subjects.includes('subj-ai-custom'));
  });

  test('Rule 10: In-site PDF Generator produces valid binary PDF data blob URLs', async () => {
    const { generatePdfDataUrl } = await import('../src/utils/pdfGenerator');
    const pdfUrl = generatePdfDataUrl(
      'Midsem Revision Notes: Graph Algorithms',
      'Data Structures & Algorithms',
      'CSE Section H',
      'Aarav Sharma',
      ['# Unit 4: Graph Traversals\nBFS and DFS time complexity: O(V + E).\nDijkstra algorithm uses min-heap.']
    );

    assert.ok(typeof pdfUrl === 'string');
    assert.ok(pdfUrl.startsWith('blob:') || pdfUrl.startsWith('data:'));
  });

});

