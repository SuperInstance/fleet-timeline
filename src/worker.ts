interface TimelineEvent {
  id: string;
  type: 'event' | 'milestone' | 'deployment' | 'incident';
  title: string;
  description: string;
  timestamp: string;
  tags: string[];
  metadata?: Record<string, any>;
}

interface TimelineResponse {
  events: TimelineEvent[];
  total: number;
  page: number;
  pageSize: number;
}

const EVENTS: TimelineEvent[] = [
  {
    id: "1",
    type: "milestone",
    title: "Initial Fleet Deployment",
    description: "First production deployment of the fleet management system",
    timestamp: "2024-01-15T10:00:00Z",
    tags: ["production", "launch"],
    metadata: { version: "1.0.0", environment: "prod" }
  },
  {
    id: "2",
    type: "deployment",
    title: "Auto-scaling Update",
    description: "Deployed auto-scaling capabilities for fleet instances",
    timestamp: "2024-01-20T14:30:00Z",
    tags: ["update", "scaling"],
    metadata: { version: "1.2.0", rollout: "gradual" }
  },
  {
    id: "3",
    type: "incident",
    title: "Database Connectivity Issue",
    description: "Temporary loss of database connectivity affecting 5% of fleet",
    timestamp: "2024-01-25T03:15:00Z",
    tags: ["incident", "resolved"],
    metadata: { severity: "medium", duration: "45m" }
  },
  {
    id: "4",
    type: "event",
    title: "Fleet Expansion",
    description: "Added 50 new instances to the fleet",
    timestamp: "2024-01-28T09:00:00Z",
    tags: ["growth", "capacity"],
    metadata: { count: 50, region: "us-east" }
  }
];

const MILESTONES: TimelineEvent[] = EVENTS.filter(e => e.type === 'milestone');

const HTML_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fleet Timeline</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --dark: #0a0a0f;
            --accent: #f59e0b;
            --light: #f8fafc;
            --gray: #64748b;
            --dark-gray: #1e293b;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--dark);
            color: var(--light);
            line-height: 1.6;
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem 1rem;
        }
        
        header {
            text-align: center;
            margin-bottom: 3rem;
            padding-bottom: 2rem;
            border-bottom: 1px solid var(--dark-gray);
        }
        
        .hero {
            margin-bottom: 1.5rem;
        }
        
        .hero h1 {
            font-size: 3rem;
            font-weight: 700;
            background: linear-gradient(135deg, var(--accent) 0%, #fbbf24 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.5rem;
        }
        
        .hero p {
            color: var(--gray);
            font-size: 1.1rem;
            max-width: 600px;
            margin: 0 auto;
        }
        
        .controls {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
            margin-bottom: 2rem;
        }
        
        .filter-btn {
            background: var(--dark-gray);
            border: 1px solid #334155;
            color: var(--light);
            padding: 0.5rem 1.5rem;
            border-radius: 0.375rem;
            cursor: pointer;
            font-family: 'Inter', sans-serif;
            font-weight: 500;
            transition: all 0.2s;
        }
        
        .filter-btn:hover {
            border-color: var(--accent);
        }
        
        .filter-btn.active {
            background: var(--accent);
            color: var(--dark);
            border-color: var(--accent);
        }
        
        .timeline {
            position: relative;
            max-width: 800px;
            margin: 0 auto;
        }
        
        .timeline::before {
            content: '';
            position: absolute;
            left: 30px;
            top: 0;
            bottom: 0;
            width: 2px;
            background: var(--dark-gray);
        }
        
        .timeline-item {
            position: relative;
            margin-bottom: 2rem;
            padding-left: 60px;
        }
        
        .timeline-marker {
            position: absolute;
            left: 20px;
            top: 0;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: var(--dark-gray);
            border: 3px solid var(--dark);
            z-index: 1;
        }
        
        .timeline-marker.milestone { background: var(--accent); }
        .timeline-marker.deployment { background: #10b981; }
        .timeline-marker.incident { background: #ef4444; }
        .timeline-marker.event { background: #3b82f6; }
        
        .timeline-content {
            background: var(--dark-gray);
            border-radius: 0.5rem;
            padding: 1.5rem;
            border: 1px solid #334155;
        }
        
        .timeline-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 0.75rem;
        }
        
        .event-type {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .type-milestone { background: rgba(245, 158, 11, 0.1); color: var(--accent); }
        .type-deployment { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .type-incident { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
        .type-event { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        
        .timeline-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: var(--light);
        }
        
        .timeline-description {
            color: var(--gray);
            margin-bottom: 1rem;
        }
        
        .timeline-tags {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }
        
        .tag {
            background: rgba(100, 116, 139, 0.1);
            color: var(--gray);
            padding: 0.25rem 0.75rem;
            border-radius: 0.25rem;
            font-size: 0.875rem;
        }
        
        .timestamp {
            color: var(--gray);
            font-size: 0.875rem;
        }
        
        footer {
            text-align: center;
            margin-top: 4rem;
            padding-top: 2rem;
            border-top: 1px solid var(--dark-gray);
            color: var(--gray);
            font-size: 0.875rem;
        }
        
        .footer-links {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-top: 1rem;
        }
        
        .footer-links a {
            color: var(--accent);
            text-decoration: none;
        }
        
        .footer-links a:hover {
            text-decoration: underline;
        }
        
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2.5rem;
            }
            
            .timeline::before {
                left: 20px;
            }
            
            .timeline-item {
                padding-left: 50px;
            }
            
            .timeline-marker {
                left: 10px;
            }
        }
        
        @media (max-width: 480px) {
            .hero h1 {
                font-size: 2rem;
            }
            
            .controls {
                flex-direction: column;
                align-items: center;
            }
            
            .filter-btn {
                width: 200px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="hero">
                <h1>Fleet Timeline</h1>
                <p>Interactive timeline of all fleet events and milestones</p>
            </div>
            <div class="controls">
                <button class="filter-btn active" data-filter="all">All Events</button>
                <button class="filter-btn" data-filter="milestone">Milestones</button>
                <button class="filter-btn" data-filter="deployment">Deployments</button>
                <button class="filter-btn" data-filter="incident">Incidents</button>
                <button class="filter-btn" data-filter="event">Events</button>
            </div>
        </header>
        
        <main>
            <div class="timeline" id="timeline">
                <!-- Timeline items will be inserted here by JavaScript -->
            </div>
        </main>
        
        <footer>
            <p>Fleet Timeline &copy; 2024. All fleet events and milestones in one place.</p>
            <div class="footer-links">
                <a href="/api/events">API: Events</a>
                <a href="/api/milestones">API: Milestones</a>
                <a href="/api/timeline">API: Timeline</a>
                <a href="/health">Health Check</a>
            </div>
        </footer>
    </div>
    
    <script>
        const events = ${JSON.stringify(EVENTS)};
        
        function formatDate(isoString) {
            const date = new Date(isoString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        
        function renderTimeline(filter = 'all') {
            const container = document.getElementById('timeline');
            const filteredEvents = filter === 'all' 
                ? events 
                : events.filter(e => e.type === filter);
            
            container.innerHTML = filteredEvents.map(event => \`
                <div class="timeline-item" data-type="\${event.type}">
                    <div class="timeline-marker \${event.type}"></div>
                    <div class="timeline-content">
                        <div class="timeline-header">
                            <span class="event-type type-\${event.type}">\${event.type}</span>
                            <span class="timestamp">\${formatDate(event.timestamp)}</span>
                        </div>
                        <h3 class="timeline-title">\${event.title}</h3>
                        <p class="timeline-description">\${event.description}</p>
                        <div class="timeline-tags">
                            \${event.tags.map(tag => \`<span class="tag">\${tag}</span>\`).join('')}
                        </div>
                    </div>
                </div>
            \`).join('');
        }
        
        document.addEventListener('DOMContentLoaded', () => {
            renderTimeline('all');
            
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    renderTimeline(btn.dataset.filter);
                });
            });
        });
    </script>
</body>
</html>
`;

export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Security headers
    const securityHeaders = {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self'",
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    };

    // Health check endpoint
    if (path === '/health') {
      return new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...securityHeaders
        }
      });
    }

    // API endpoints
    if (path === '/api/events') {
      const response: TimelineResponse = {
        events: EVENTS,
        total: EVENTS.length,
        page: 1,
        pageSize: EVENTS.length
      };
      return new Response(JSON.stringify(response), {
        headers: {
          'Content-Type': 'application/json',
          ...securityHeaders
        }
      });
    }

    if (path === '/api/milestones') {
      const response: TimelineResponse = {
        events: MILESTONES,
        total: MILESTONES.length,
        page: 1,
        pageSize: MILESTONES.length
      };
      return new Response(JSON.stringify(response), {
        headers: {
          'Content-Type': 'application/json',
          ...securityHeaders
        }
      });
    }

    if (path === '/api/timeline') {
      const page = parseInt(url.searchParams.get('page') || '1');
      const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
      const type = url.searchParams.get('type');
      
      let filteredEvents = EVENTS;
      if (type) {
        filteredEvents = EVENTS.filter(event => event.type === type);
      }
      
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedEvents = filteredEvents.slice(start, end);
      
      const response: TimelineResponse = {
        events: paginatedEvents,
        total: filteredEvents.length,
        page,
        pageSize
      };
      
      return new Response(JSON.stringify(response), {
        headers: {
          'Content-Type': 'application/json',
          ...securityHeaders
        }
      });
    }

    // Serve HTML for all other routes
    return new Response(HTML_TEMPLATE, {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        ...securityHeaders
      }
    });
  }
};