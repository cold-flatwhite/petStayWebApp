import React from "react";
import { render, screen } from '@testing-library/react';
import NotFound from '../components/NotFound';

describe('NotFound Component',()=> {
    test('display the correct text', ()=>{
        render(<NotFound/>);
        expect(screen.getByText('NotFound')).toBeInTheDocument();
    })
})