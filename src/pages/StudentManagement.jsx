import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../components/Card';
import { Button } from '../components/Button';

export const StudentManagement = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-600">Course ID: {id}</p>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Student management functionality will be implemented here.</p>
          <Button className="mt-4">View Students</Button>
        </CardContent>
      </Card>
    </div>
  );
};
