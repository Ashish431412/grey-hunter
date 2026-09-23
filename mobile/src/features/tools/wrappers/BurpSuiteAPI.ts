export class BurpSuiteAPI {
  private endpoint: string;
  private apiKey: string;

  constructor(endpoint: string = 'http://127.0.0.1:1337', apiKey: string = '') {
    this.endpoint = endpoint;
    this.apiKey = apiKey;
  }

  async startScan(url: string): Promise<string> {
    const response = await fetch(`${this.endpoint}/v0.1/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({ urls: [url] })
    });
    
    if (!response.ok) throw new Error('Failed to start scan');
    const data = await response.json();
    return data.task_id;
  }

  async getFindings(taskId: string): Promise<any[]> {
    const response = await fetch(`${this.endpoint}/v0.1/scan/${taskId}/issues`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to get findings');
    return await response.json();
  }
}
