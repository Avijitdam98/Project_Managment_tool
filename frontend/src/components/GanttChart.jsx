import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Maximize2, 
  Minimize2, 
  Columns3, 
  MoreVertical,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import gantt from 'dhtmlx-gantt';
import { format } from 'date-fns';

const GanttChart = ({ 
  tasks, 
  onColumnResize,
  onTaskUpdate,
  showContextMenu = true 
}) => {
  const [expanded, setExpanded] = useState(false);
  const ganttContainer = useRef(null);

  useEffect(() => {
    // Basic configuration
    gantt.config.date_format = "%Y-%m-%d %H:%i";
    gantt.config.drag_links = true;
    gantt.config.drag_progress = true;
    gantt.config.drag_resize = true;
    gantt.config.drag_move = true;

    // Scale configuration
    gantt.config.scale_height = 60;
    gantt.config.scales = [
      { unit: "month", step: 1, format: "%F %Y" },
      { unit: "week", step: 1, format: "Week #%W" }
    ];

    // Initialize zoom configuration
    const zoomConfig = {
      levels: [
        {
          name: "day",
          scale_height: 60,
          min_column_width: 70,
          scales: [
            { unit: "day", step: 1, format: "%d %M" }
          ]
        },
        {
          name: "week",
          scale_height: 60,
          min_column_width: 70,
          scales: [
            { unit: "week", step: 1, format: "Week #%W" },
            { unit: "day", step: 1, format: "%d %M" }
          ]
        },
        {
          name: "month",
          scale_height: 60,
          min_column_width: 70,
          scales: [
            { unit: "month", step: 1, format: "%F" },
            { unit: "week", step: 1, format: "Week #%W" }
          ]
        },
        {
          name: "quarter",
          scale_height: 60,
          min_column_width: 90,
          scales: [
            { unit: "month", step: 3, format: "%F" },
            { unit: "month", step: 1, format: "%M" }
          ]
        },
        {
          name: "year",
          scale_height: 60,
          min_column_width: 120,
          scales: [
            { unit: "year", step: 1, format: "%Y" },
            { unit: "month", step: 1, format: "%M" }
          ]
        }
      ]
    };

    gantt.ext.zoom.init(zoomConfig);
    let currentLevel = 2; // Start with month view

    // Zoom control functions
    const zoomIn = () => {
      currentLevel = Math.min(currentLevel + 1, zoomConfig.levels.length - 1);
      gantt.ext.zoom.setLevel(currentLevel);
    };

    const zoomOut = () => {
      currentLevel = Math.max(currentLevel - 1, 0);
      gantt.ext.zoom.setLevel(currentLevel);
    };

    // Attach zoom functions to window for button access
    window.ganttZoomIn = zoomIn;
    window.ganttZoomOut = zoomOut;

    // Row and column settings
    gantt.config.row_height = 60;  
    gantt.config.min_column_width = 50;
    gantt.config.grid_resize = true;
    gantt.config.show_progress = true;

    // Column configuration
    gantt.config.columns = [
      { 
        name: "text", 
        label: "Task Name", 
        tree: true, 
        width: 300,  
        resize: true,
        template: (task) => {
          const status = task.status === 'completed' ? '✓' : 
                        task.status === 'inProgress' ? '↻' : '○';
          return `<div class="task-title">
                    <span class="task-status ${task.status}">${status}</span>
                    <span class="task-name">${task.text}</span>
                  </div>`;
        }
      },
      { 
        name: "start_date", 
        label: "Start Date", 
        align: "center", 
        width: 120,
        resize: true,
        template: (task) => format(new Date(task.start_date), 'MMM d, yyyy')
      },
      { 
        name: "duration", 
        label: "Duration", 
        align: "center", 
        width: 80,
        template: (task) => `${task.duration} days`
      },
      { 
        name: "progress", 
        label: "Progress", 
        align: "center", 
        width: 120,  
        template: (task) => {
          const progress = Math.round(task.progress * 100);
          return `<div class="progress-container">
                    <div class="progress-bar" style="width: ${progress}%">
                      ${progress}%
                    </div>
                  </div>`;
        }
      },
      { 
        name: "assigned", 
        label: "Assignee", 
        align: "center", 
        width: 120,
        template: (task) => `<div class="assignee">${task.assigned}</div>`
      }
    ];

    // Task templates
    gantt.templates.task_class = (start, end, task) => {
      return task.status === 'completed' ? 'completed-task' : 
             task.status === 'inProgress' ? 'in-progress-task' : 'todo-task';
    };

    gantt.templates.task_text = (start, end, task) => {
      const progress = Math.round(task.progress * 100);
      return `<div class="task-content">
                <span class="task-name">${task.text}</span>
                <span class="task-progress">${progress}%</span>
              </div>`;
    };

    gantt.templates.tooltip_text = (start, end, task) => {
      const progress = Math.round(task.progress * 100);
      const startDate = format(new Date(start), 'MMM d, yyyy');
      const endDate = format(new Date(end), 'MMM d, yyyy');
      
      return `<div class="gantt-tooltip">
                <strong>${task.text}</strong>
                <p>Status: ${task.status}</p>
                <p>Progress: ${progress}%</p>
                <p>Start: ${startDate}</p>
                <p>End: ${endDate}</p>
                <p>Duration: ${task.duration} days</p>
                <p>Assigned to: ${task.assigned}</p>
              </div>`;
    };

    // Task drag handler
    gantt.attachEvent("onAfterTaskUpdate", (id, task) => {
      if (onTaskUpdate) {
        const updatedTask = {
          _id: task.id,
          title: task.text,
          startDate: new Date(task.start_date),
          dueDate: new Date(task.end_date),
          duration: task.duration,
          status: task.status,
          progress: task.progress,
          assignee: { name: task.assigned }
        };
        onTaskUpdate(updatedTask);
      }
    });

    // Progress drag handler
    gantt.attachEvent("onTaskDrag", (id, mode, task, original) => {
      if (mode === gantt.config.drag_mode.progress) {
        const progress = Math.round(task.progress * 100) / 100;
        task.status = progress >= 1 ? 'completed' : 
                     progress >= 0.5 ? 'inProgress' : 'todo';
        gantt.refreshTask(id);
      }
    });

    // Initialize gantt
    gantt.init(ganttContainer.current);

    return () => {
      gantt.clearAll();
    };
  }, []);

  useEffect(() => {
    if (!tasks?.length) return;

    const formattedTasks = tasks.map(task => ({
      id: task._id,
      text: task.title,
      start_date: task.startDate || new Date(),
      duration: task.duration || 1,
      progress: task.status === 'completed' ? 1 : 
               task.status === 'inProgress' ? 0.5 : 0,
      assigned: task.assignee?.name || 'Unassigned',
      parent: task.parentId || null
    }));

    const links = tasks.reduce((acc, task) => {
      if (task.dependencies) {
        const taskLinks = task.dependencies.map(dep => ({
          id: `${dep.task._id || dep.task}-${task._id}`,
          source: dep.task._id || dep.task,
          target: task._id,
          type: '0'
        }));
        return [...acc, ...taskLinks];
      }
      return acc;
    }, []);

    gantt.clearAll();
    gantt.parse({
      data: formattedTasks,
      links: links
    });
  }, [tasks]);

  useEffect(() => {
    if (ganttContainer.current) {
      ganttContainer.current.style.height = expanded ? '700px' : '500px';
      gantt.render();
    }
  }, [expanded]);

  return (
    <div className="gantt-container">
      <style>{`
        .gantt_task_progress {
          background-color: rgba(66, 153, 225, 0.8);
          border-radius: 4px;
          height: 100% !important;
        }
        .gantt_task_progress_drag {
          display: none;
        }
        .gantt_task_line {
          border-radius: 8px;
          background-color: #4299e1;
          transition: width 0.5s ease;
          height: 40px !important;  
        }
        .gantt_cell {
          font-size: 14px !important;  
          padding: 8px 12px !important;
        }
        .task-name {
          font-size: 14px;
          font-weight: 500;
          color: var(--foreground);
        }
        .task-title {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 0;
          font-size: 14px;
        }
        .task-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 12px;
          height: 100%;
          font-size: 14px;
          font-weight: 500;
        }
        .completed-task {
          background-color: #48bb78 !important;
        }
        .in-progress-task {
          background-color: #f7dc6f !important;
        }
        .todo-task {
          background-color: #f56565 !important;
        }
      `}</style>
      {showContextMenu && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
          <button
            onClick={() => window.ganttZoomOut()}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => window.ganttZoomIn()}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      )}
      <div 
        ref={ganttContainer} 
        style={{ 
          height: expanded ? '700px' : '500px',
          transition: 'height 0.3s ease'
        }}
      />
    </div>
  );
};

export default GanttChart;