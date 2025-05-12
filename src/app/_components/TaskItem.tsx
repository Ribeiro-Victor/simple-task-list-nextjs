import React from 'react';

interface TaskItemProps {
    task: {
        id: string;
        title: string;
        description?: string;
        createdDate: string;
    };
    onEdit?: () => void;
    onDelete?: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete }) => {
    return (
        <li className="border p-2 relative">
            <div className="flex flex-col w-full">
                {/* Buttons - Top Right */}
                <div className="absolute top-2 right-2 flex items-center gap-2">
                    {onEdit && (
                        <button
                            onClick={onEdit}
                            className="text-blue-500 hover:underline text-sm"
                        >
                            Editar
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={onDelete}
                            className="text-red-500 hover:underline text-sm"
                        >
                            Deletar
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="flex flex-col w-full pr-24"> {/* padding-right to avoid overlap with buttons */}
                    <strong className="truncate" style={{ maxWidth: '100%' }}>
                        {task.title}
                    </strong>
                    <p className="text-sm text-gray-600 mt-1 break-words overflow-hidden max-h-20">
                        {task.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                        Criado em: {new Date(task.createdDate).toLocaleDateString('pt-BR')} às{' '}
                        {new Date(task.createdDate).toLocaleTimeString('pt-BR', { hour12: false })}
                    </p>
                </div>
            </div>
        </li>
    );
};

export default TaskItem;
