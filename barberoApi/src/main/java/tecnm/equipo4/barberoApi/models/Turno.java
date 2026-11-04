package tecnm.equipo4.barberoApi.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "turno")
public class Turno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idTurno")
    private Long idTurno;

    @Column(name = "fecha")
    private String fecha;

    @Column(name = "horaInicio")
    private String horaInicio;

    @Column(name = "estado")
    private String estado;

    @Column(name = "notasCliente")
    private String notasCliente;

    @Column(name = "sucursal")
    private String sucursal;

    @ManyToOne
    @JoinColumn(name = "idCliente")
    @JsonIgnoreProperties({"foto"})
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "idBarbero")
    @JsonIgnoreProperties({"foto"})
    private Barbero barbero;

    @ManyToOne
    @JoinColumn(name = "idServicio")
    private Servicio servicio;
}
