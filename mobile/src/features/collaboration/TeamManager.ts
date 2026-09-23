export type Role = 'OWNER' | 'EDITOR' | 'VIEWER';

export interface TeamMember {
  userId: string;
  email: string;
  role: Role;
}

export class TeamManager {
  private members: Map<string, TeamMember[]> = new Map();

  async inviteMember(projectId: string, email: string, role: Role): Promise<void> {
    const current = this.members.get(projectId) || [];
    current.push({ userId: Date.now().toString(), email, role });
    this.members.set(projectId, current);
  }

  async removeMember(projectId: string, userId: string): Promise<void> {
    const current = this.members.get(projectId) || [];
    this.members.set(
      projectId,
      current.filter((m) => m.userId !== userId)
    );
  }

  async changeRole(projectId: string, userId: string, newRole: Role): Promise<void> {
    const current = this.members.get(projectId) || [];
    const idx = current.findIndex((m) => m.userId === userId);
    if (idx !== -1) {
      current[idx].role = newRole;
      this.members.set(projectId, current);
    }
  }

  async getMembers(projectId: string): Promise<TeamMember[]> {
    return this.members.get(projectId) || [];
  }
}

export const teamManager = new TeamManager();
