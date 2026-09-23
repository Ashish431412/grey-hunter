export interface Task {
  id: string;
  title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  assignee?: string;
  dueDate?: string;
  isBlocked?: boolean;
  blockedReason?: string;
}

export interface ProjectData {
  name: string;
}

export class StatusReportGenerator {
  static generateReport(project: ProjectData, tasks: Task[], dateRange: string): string {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'DONE');
    const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS');
    const blocked = tasks.filter((t) => t.isBlocked);

    const teamContribs: Record<string, number> = {};
    tasks.forEach((t) => {
      if (t.assignee) {
        teamContribs[t.assignee] = (teamContribs[t.assignee] || 0) + 1;
      }
    });

    let report = `# Status Report: ${project.name}\n`;
    report += `**Date Range**: ${dateRange}\n`;
    report += `**Generated**: ${new Date().toISOString()}\n\n`;

    report += `## Summary Statistics\n`;
    report += `- Total Tasks: ${total}\n`;
    report += `- Completed: ${completed.length}\n`;
    report += `- In Progress: ${inProgress.length}\n`;
    report += `- Blocked: ${blocked.length}\n\n`;

    report += `## In Progress\n`;
    inProgress.forEach((t) => {
      report += `- ${t.title} (Assigned to: ${t.assignee || 'Unassigned'})\n`;
    });
    report += '\n';

    report += `## Blocked Tasks\n`;
    blocked.forEach((t) => {
      report += `- ${t.title} - Reason: ${t.blockedReason || 'Unknown'}\n`;
    });
    report += '\n';

    report += `## Team Contributions\n`;
    Object.entries(teamContribs).forEach(([member, count]) => {
      report += `- ${member}: ${count} tasks\n`;
    });
    report += '\n';

    return report;
  }
}
