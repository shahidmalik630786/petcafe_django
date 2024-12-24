from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class PageNumberPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        total_count = self.page.paginator.count  # Total items in the filtered queryset
        return Response({
            'draw': self.request.query_params.get('draw', '1') if hasattr(self, 'request') else '1',
            'recordsTotal': total_count,
            'recordsFiltered': total_count,  
            'data': data,
            'totalPages': self.get_total_pages(total_count),  
            'next_page': self.get_next_page(),
            'previous_page': self.get_previous_page()
        })

    def get_total_pages(self, total_count):
        return (total_count // self.page_size) + (1 if total_count % self.page_size else 0)

    def get_next_page(self):
        return self.page.next_page_number() if self.page.has_next() else None

    def get_previous_page(self):
        return self.page.previous_page_number() if self.page.has_previous() else None
    

