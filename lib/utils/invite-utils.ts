import { prisma } from "../prisma";

export async function checkAndExpireInvite(inviteId: string) {
  const invite = await (prisma as any).invite.findUnique({
    where: { id: inviteId },
  });

  if (!invite) {
    return { expired: false, invite: null };
  }

  // Check if invite has expired
  if (invite.expiresAt && invite.expiresAt < new Date()) {
    // Mark as expired if not already
    if (invite.status === "pending") {
      await (prisma as any).invite.update({
        where: { id: inviteId },
        data: {
          status: "expired",
          respondedAt: new Date(),
        },
      });
    }
    return { expired: true, invite };
  }

  return { expired: false, invite };
}

export async function createWritingSpaceAccess(projectId: string, mentorId: string, studentId: string) {
  // Create or update writing space access
  await (prisma as any).writingSpaceAccess.upsert({
    where: {
      timelineId_mentorId: {
        timelineId: projectId,
        mentorId: mentorId,
      },
    },
    update: {
      accessType: "COMMENT",
      grantedAt: new Date(),
    },
    create: {
      timelineId: projectId,
      mentorId: mentorId,
      studentId: studentId,
      accessType: "COMMENT",
      grantedAt: new Date(),
    },
  });
}
