export interface NavItem {
    color: string;
    element: HTMLElement;
    id: number;
    isActive: boolean;
    type: 'DEFAULT' | 'PARENT';
    childNavigation?: HTMLElement;
    onClick: (event: MouseEvent) => void;
}

export interface State {
    navigationItems: Record<number, NavItem>;
    root: HTMLElement | null;
    activeItem?: number; // ID of the active item
}
